// Glass Card Theme Transition Tests
//
// 測試目標：驗證切換 theme-day / theme-night 時，.lg-glass 卡片背景確實更新
// 設計：backdrop-filter 已全面移除，主題由 .theme-day / .theme-night class 控制
// 唯一依據：目的地當地時間（非系統 prefers-color-scheme）
//
// 執行前提：本機需先啟動 server → npm run serve（或 python3 -m http.server 8080）

const TRANSITION_SETTLE_MS = 1100  // 0.8s transition + 300ms buffer

// 解析 RGB(A) 字串的 R 通道數值
const parseR = (bg) => parseInt(bg.match(/rgba?\((\d+)/)?.[1] ?? '128')

describe('Glass Card - CSS Architecture', () => {
  const setup = () => {
    cy.visit('/')
    cy.get('#app').should('exist')
    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-day text-slate-800')
  }

  it('#app inline style 使用明確 background/color 過渡，而非 transition-all', () => {
    setup()
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

  it('從 theme-day 切換到 theme-night 後，背景應變為深色（R < 60）', () => {
    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-day text-slate-800')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('.lg-glass').first().then($el => {
      const dayBg = window.getComputedStyle($el[0]).backgroundColor
      cy.log('day mode bg:', dayBg)
      expect(parseR(dayBg), 'day mode R channel 應 > 200').to.be.greaterThan(200)
    })

    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-night text-white')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('.lg-glass').first().then($el => {
      const nightBg = window.getComputedStyle($el[0]).backgroundColor
      cy.log('night mode bg:', nightBg)
      expect(parseR(nightBg), 'night mode R channel 應 < 60').to.be.lessThan(60)
    })
  })

  it('從 theme-night 切換到 theme-day 後，背景應回到白色（R > 200）', () => {
    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-night text-white')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('.lg-glass').first().then($el => {
      const nightBg = window.getComputedStyle($el[0]).backgroundColor
      cy.log('night mode bg:', nightBg)
      expect(parseR(nightBg), 'night mode R channel 應 < 60').to.be.lessThan(60)
    })

    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-day text-slate-800')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('.lg-glass').first().then($el => {
      const dayBg = window.getComputedStyle($el[0]).backgroundColor
      cy.log('back to day mode bg:', dayBg)
      expect(parseR(dayBg), 'day mode R channel 應 > 200').to.be.greaterThan(200)
    })
  })

  it('連續來回切換三次後，最終夜間狀態應正確（R < 60）', () => {
    const FAST_SETTLE = 900

    const setDay   = () => cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-day text-slate-800')
    const setNight = () => cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-night text-white')

    setDay();   cy.wait(FAST_SETTLE)
    setNight(); cy.wait(FAST_SETTLE)
    setDay();   cy.wait(FAST_SETTLE)
    setNight(); cy.wait(FAST_SETTLE)
    setDay();   cy.wait(FAST_SETTLE)
    setNight(); cy.wait(FAST_SETTLE)

    cy.get('.lg-glass').first().then($el => {
      const finalBg = window.getComputedStyle($el[0]).backgroundColor
      cy.log('final night bg:', finalBg)
      expect(parseR(finalBg), '最終 night mode R channel 應 < 60').to.be.lessThan(60)
    })
  })
})

describe('Glass Card - All Cards Updated', () => {
  before(() => {
    cy.visit('/')
    cy.get('#app').should('exist')
  })

  it('切換到 theme-night 後，所有 .lg-glass 元素都應更新為深色背景', () => {
    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-day text-slate-800')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('#app').invoke('attr', 'class', 'min-h-screen theme-night text-white')
    cy.wait(TRANSITION_SETTLE_MS)

    cy.get('.lg-glass').then($cards => {
      cy.log(`共 ${$cards.length} 張 .lg-glass 卡片`)
      expect($cards.length, '應至少有 1 張卡片').to.be.greaterThan(0)

      $cards.each((i, el) => {
        const bg = window.getComputedStyle(el).backgroundColor
        const r = parseR(bg)
        expect(r, `卡片 #${i} R channel 應 < 60，實際: ${bg}`).to.be.lessThan(60)
      })
    })
  })
})
