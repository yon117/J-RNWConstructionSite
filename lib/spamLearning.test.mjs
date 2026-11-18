import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    EMPTY_SENDERS, addLearnedSender, removeLearnedSender, isLearnedSender,
    trainModel, spamProbability, isLearnedSpam
} from './spamLearning.mjs';

// ---- learned senders ----

test('company domain is learned as a whole domain', () => {
    const list = addLearnedSender(EMPTY_SENDERS, 'wyatt@automaxrevenue.com');
    assert.deepEqual(list.domains, ['automaxrevenue.com']);
    assert.equal(isLearnedSender(list, 'someone.else@automaxrevenue.com'), true);
});

test('free-mail sender is learned by exact address, never the whole domain', () => {
    const list = addLearnedSender(EMPTY_SENDERS, 'Sales.Ads.Mogul+x@gmail.com');
    assert.deepEqual(list.domains, []);
    assert.equal(isLearnedSender(list, 'salesadsmogul@gmail.com'), true); // dots/+tags ignored
    assert.equal(isLearnedSender(list, 'a.real.customer@gmail.com'), false);
});

test('learning does not mutate the previous list and removing undoes it', () => {
    const before = addLearnedSender(EMPTY_SENDERS, 'x@spam-agency.com');
    const after = removeLearnedSender(before, 'y@spam-agency.com');
    assert.deepEqual(before.domains, ['spam-agency.com']);
    assert.deepEqual(after.domains, []);
    assert.deepEqual(EMPTY_SENDERS.domains, []);
});

// ---- bayes ----

const SPAM_TEXTS = Array.from({ length: 10 }, (_, i) =>
    `Grow your business with our marketing agency. We guarantee more leads, free demo video number ${i}. Unsubscribe here https://x.io/u${i}`);
const HAM_TEXTS = Array.from({ length: 25 }, (_, i) =>
    `Hi, we need someone to repair our kitchen cabinets and paint the bathroom. Please call me to schedule a visit, job ${i}.`);

test('returns null until there is enough training data', () => {
    const tiny = trainModel(SPAM_TEXTS.slice(0, 2), HAM_TEXTS.slice(0, 5));
    assert.equal(spamProbability(tiny, 'grow your business with marketing'), null);
});

test('flags a new pitch that shares vocabulary with known spam', () => {
    const model = trainModel(SPAM_TEXTS, HAM_TEXTS);
    assert.equal(isLearnedSpam(model, 'Our marketing agency can grow your business, guaranteed leads. Free demo video. Unsubscribe'), true);
});

test('does not flag a real customer message', () => {
    const model = trainModel(SPAM_TEXTS, HAM_TEXTS);
    assert.equal(isLearnedSpam(model, 'We need our bathroom painted and a cabinet repaired. Please call me.'), false);
});

test('never flags a message that asks for an estimate, even with spammy words', () => {
    const model = trainModel(SPAM_TEXTS, HAM_TEXTS);
    assert.equal(isLearnedSpam(model, 'Can I get a free estimate? I saw your marketing, we need our kitchen remodeled, grow your business'), false);
});
