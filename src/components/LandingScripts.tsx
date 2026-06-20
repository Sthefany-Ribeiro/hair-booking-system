'use client'

import { useEffect } from 'react'

export default function LandingScripts() {
  useEffect(() => {
    const nav = document.getElementById('nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    onScroll()

    const navToggle = document.getElementById('navToggle')
    const mobileMenu = document.getElementById('mobileMenu')
    const mobileClose = document.getElementById('mobileClose')
    const openMenu = () => mobileMenu?.classList.add('active')
    const closeMenu = () => mobileMenu?.classList.remove('active')
    navToggle?.addEventListener('click', openMenu)
    mobileClose?.addEventListener('click', closeMenu)
    mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu))

   // Força todos os elementos reveal a ficarem visíveis
   // independente do observer (resolve o bug ao voltar de outra página)
   const revealEls = document.querySelectorAll('.reveal')

   const showVisible = () => {
    revealEls.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight + 100) {
        el.classList.add('visible')
        }
    })
    }

// Roda imediatamente ao montar
showVisible()

// E continua observando o scroll para os elementos abaixo da dobra
window.addEventListener('scroll', showVisible)

    const faqItems = document.querySelectorAll('.faq-item')
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question')
      const answer = item.querySelector('.faq-answer') as HTMLElement | null
      if (item.classList.contains('active') && answer) {
        answer.style.maxHeight = answer.scrollHeight + 'px'
      }
      btn?.addEventListener('click', () => {
        const isActive = item.classList.contains('active')
        faqItems.forEach(i => {
          i.classList.remove('active')
          const a = i.querySelector('.faq-answer') as HTMLElement | null
          if (a) a.style.maxHeight = '0'
        })
        if (!isActive && answer) {
          item.classList.add('active')
          answer.style.maxHeight = answer.scrollHeight + 'px'
        }
      })
    })

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault()
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href')
        if (!href) return
        const target = document.querySelector(href)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', showVisible)     
    }
  }, [])

  return null
}