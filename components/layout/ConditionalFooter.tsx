'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
    const pathname = usePathname()

    // Don't render footer on the home page — it has its own footer inside ProductGridOverlay
    if (pathname === '/') return null

    return <Footer />
}
