'use client'

import { useEffect } from 'react'

export default function LandingScripts() {
  useEffect(() => {
    // Nav scroll
    const nav = document.getElementById('nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 60)
    window.addEventListener('scroll', onScroll)

    // Mobile menu
    const navToggle = document.getElementById('navToggle')
    const mobileMenu = document.getElementById('mobileMenu')
    const mobileClose = document.getElementById('mobileClose')
    navToggle?.addEventListener('click', () => mobileMenu?.classList.add('active'))
    mobileClose?.addEventListener('click', () => mobileMenu?.classList.remove('active'))

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    revealEls.forEach(el => observer.observe(el))

    // FAQ
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement
        const isActive = item?.classList.contains('active')
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'))
        if (!isActive) item?.classList.add('active')
      })
    })

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
      e.preventDefault()
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href')
      const target = href ? document.querySelector(href) : null
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
})

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}