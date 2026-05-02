// Glass Card Theme Transition Tests
//
// 測試目標：驗證切換 theme-light / theme-dark 時，.lg-glass 卡片背景確實更新
// 背景：修復前 #app 使用 transition-all，Safari GPU 合成層導致卡片視覺停留在舊狀態
//
// 執行前提：本機需先啟動 server → npm run serve（或 python3 -m http.server 8080）

const LIGHT_BG_PATTERN = /rgba\(255,\s*255,\s*255/
const DARK_BG_PATTERN = /rgba\(3[0-9],\s*3[0-9],\s*[3-5][0-9]/
const TRANSITION_SETTLE_MS = 1100  // 0.8s transition + 300ms buffer

// 解析 RGB(A) 字串的 R 通道數值
const parseR = (bg) => parseInt(bg.match(/rgba?\((\d+)/)?.[1] ?? '128')

describe('Glass Card - CSS Architecture', () => {
  // 每個 it 各自 visit，避免 before() 狀態在 headless 模式下遺失
  const setup = () => {
    cy.visit('/')
    cy.get('#app').should('exist')
    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-light text-slate-800')
  }

  it('#app inline style 使用明確 background/color 過渡，而非 transition-all', () => {
    setup()
    // 修復前：Tailwind class "transition-all duration-1000" 在 #app 上
    // 修復後：改用 inline style "transition: background 1s ease, color 1s ease;"
    cy.get('#app').invoke('attr', 'style').then(style => {
      cy.log('inline style:', style)
      expect(style, 'style 應包含 transition').to.include('transition')
      expect(style, 'style 應包含 background').to.include('background')
      expect(style, 'style 不應有 transition-all').not.to.include('transition-all')
    })
  })

  it('#app computed transition-property 不應是 "all"', () => {
    setup()
    cy.get('#app').then($el => {
      const transitionProp = window.getComputedStyle($el[0]).transitionProperty
      cy.log('transitionProperty:', transitionProp)
      // transition-all 展開後 transitionProperty = "all"
      expect(transitionProp.trim()).not.to.equal('all')
    })
  })

  it('.lg-glass 的 transition-property 應包含 background', () => {
    setup()
    cy.get('.lg-glass').first().should('exist').then($el => {
      const transitionProp = window.getComputedStyle($el[0]).transitionProperty
      cy.log('.lg-glass transitionProperty:', transitionProp)
      expect(
        transitionProp.includes('background') || transitionProp.includes('all'),
        'transition-property 應包含 background'
      ).to.be.true
    })
  })

  it('.lg-glass 的 backdrop-filter 應為 none 或空（已全面移除以修復 Safari GPU 快取問題）', () => {
    setup()
    cy.get('.lg-glass').first().should('exist').then($el => {
      const style = window.getComputedStyle($el[0])
      const bf  = style.backdropFilter       ?? ''
      const wbf = style.webkitBackdropFilter ?? ''
      cy.log('backdropFilter:', bf, '/ webkitBackdropFilter:', wbf)
      expect(
        bf === 'none' || bf === '' || wbf === 'none' || wbf === '',
        'backdrop-filter 應為 none 或空（已移除以避免 Safari GPU 合成層問題）'
      ).to.be.true
    })
  })

})

describe('Glass Card - Background Color Transition', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#app').should('exist')
  })

  it('從 theme-light 切換到 theme-dark 後，背景應變為深色', () => {
    // 先確保 light 狀態穩定
    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-light text-slate-800')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('.lg-glass').first().then($el => {
      const lightBg = window.getComputedStyle($el[0]).backgroundColor
      cy.log('light mode bg:', lightBg)
      expect(parseR(lightBg), 'light mode R channel 應 > 200').to.be.greaterThan(200)
    })

    // 切換到 dark
    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-dark text-white')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('.lg-glass').first().then($el => {
      const darkBg = window.getComputedStyle($el[0]).backgroundColor
      cy.log('dark mode bg:', darkBg)
      expect(parseR(darkBg), 'dark mode R channel 應 < 80').to.be.lessThan(80)
    })
  })

  it('從 theme-dark 切換到 theme-light 後，背景應回到白色', () => {
    // 先確保 dark 狀態穩定
    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-dark text-white')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('.lg-glass').first().then($el => {
      const darkBg = window.getComputedStyle($el[0]).backgroundColor
      cy.log('dark mode bg:', darkBg)
      expect(parseR(darkBg), 'dark mode R channel 應 < 80').to.be.lessThan(80)
    })

    // 切換回 light
    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-light text-slate-800')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('.lg-glass').first().then($el => {
      const lightBg = window.getComputedStyle($el[0]).backgroundColor
      cy.log('back to light mode bg:', lightBg)
      expect(parseR(lightBg), 'light mode R channel 應 > 200').to.be.greaterThan(200)
    })
  })

  it('連續來回切換三次後，最終狀態應正確', () => {
    const FAST_SETTLE = 900

    const setLight = () => cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-light text-slate-800')
    const setDark  = () => cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-dark text-white')

    setLight(); cy.wait(FAST_SETTLE)
    setDark();  cy.wait(FAST_SETTLE)
    setLight(); cy.wait(FAST_SETTLE)
    setDark();  cy.wait(FAST_SETTLE)
    setLight(); cy.wait(FAST_SETTLE)
    setDark();  cy.wait(FAST_SETTLE)

    cy.get('.lg-glass').first().then($el => {
      const finalBg = window.getComputedStyle($el[0]).backgroundColor
      cy.log('final dark bg:', finalBg)
      expect(parseR(finalBg), '最終 dark mode R channel 應 < 80').to.be.lessThan(80)
    })
  })
})

describe('Glass Card - All Cards Updated', () => {
  before(() => {
    cy.visit('/')
    cy.get('#app').should('exist')
  })

  it('切換主題後，所有 .lg-glass 元素都應更新背景', () => {
    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-light text-slate-800')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-dark text-white')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('.lg-glass').then($cards => {
      cy.log(`共 ${$cards.length} 張 .lg-glass 卡片`)
      expect($cards.length, '應至少有 1 張卡片').to.be.greaterThan(0)

      $cards.each((i, el) => {
        const bg = window.getComputedStyle(el).backgroundColor
        const r = parseR(bg)
        expect(r, `卡片 #${i} R channel 應 < 80，實際: ${bg}`).to.be.lessThan(80)
      })
    })
  })
})
