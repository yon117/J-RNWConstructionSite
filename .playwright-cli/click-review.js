async function(page) {
    await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('button[aria-label^="Read full review"]')]
        const visibleButton = buttons.find((button) => {
            const rect = button.getBoundingClientRect()
            return rect.left >= 0 && rect.right <= window.innerWidth && rect.top >= 0 && rect.bottom <= window.innerHeight
        })

        if (visibleButton) {
            visibleButton.click()
        }
    })
}
