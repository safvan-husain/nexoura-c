'use client'

import React from 'react'

interface FooterProps {
    className?: string
}

export default function Footer({ className = '' }: FooterProps) {
    return (
        <footer className={`bg-[#d6d1ca] px-6 sm:px-10 lg:px-16 py-14 ${className}`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1.4fr_1fr_auto] gap-12 md:gap-16">
                {/* Newsletter */}
                <div>
                    <h3 className="text-2xl md:text-3xl font-semibold italic text-gray-900 mb-2">
                        Let&apos;s get in touch
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                        Sign up for our newsletter and receive 10% off your first order
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 border border-gray-400 bg-transparent rounded-none text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-800 transition-colors"
                        />
                    </div>
                    <button className="mt-4 px-7 py-3 bg-gray-900 text-white text-sm font-semibold tracking-wide hover:bg-gray-800 transition-colors">
                        Subscribe now
                    </button>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-base font-semibold italic text-gray-900 mb-5">Quick link</h4>
                    <ul className="space-y-3">
                        {['Home', 'Products', 'Contact'].map(link => (
                            <li key={link}>
                                <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">
                                    {link}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Our Store / Social Icons */}
                <div>
                    <h4 className="text-base font-semibold italic text-gray-900 mb-5">Our store</h4>
                    <div className="flex gap-3">
                        {/* Facebook */}
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center hover:bg-gray-500/40 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
                            </svg>
                        </a>
                        {/* Instagram */}
                        <a
                            href="#"
                            aria-label="Instagram"
                            className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center hover:bg-gray-500/40 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 011.522.99 4.088 4.088 0 01.99 1.522c.163.46.349 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 01-.99 1.522 4.088 4.088 0 01-1.522.99c-.46.163-1.26.349-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 01-1.522-.99 4.088 4.088 0 01-.99-1.522c-.163-.46-.349-1.26-.403-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.088 4.088 0 01.99-1.522 4.088 4.088 0 011.522-.99c.46-.163 1.26-.349 2.43-.403C8.416 2.175 8.796 2.163 12 2.163zm0 1.838c-3.153 0-3.506.012-4.748.069-1.075.049-1.658.229-2.047.38a3.248 3.248 0 00-1.208.785 3.248 3.248 0 00-.785 1.208c-.151.389-.331.972-.38 2.047C2.775 8.494 2.763 8.847 2.763 12s.012 3.506.069 4.748c.049 1.075.229 1.658.38 2.047.178.456.414.853.785 1.208.355.371.752.607 1.208.785.389.151.972.331 2.047.38 1.242.057 1.595.069 4.748.069s3.506-.012 4.748-.069c1.075-.049 1.658-.229 2.047-.38a3.248 3.248 0 001.208-.785 3.248 3.248 0 00.785-1.208c.151-.389.331-.972.38-2.047.057-1.242.069-1.595.069-4.748s-.012-3.506-.069-4.748c-.049-1.075-.229-1.658-.38-2.047a3.248 3.248 0 00-.785-1.208 3.248 3.248 0 00-1.208-.785c-.389-.151-.972-.331-2.047-.38C15.506 4.013 15.153 4.001 12 4.001zm0 3.15a4.849 4.849 0 110 9.698 4.849 4.849 0 010-9.698zm0 1.838a3.011 3.011 0 100 6.022 3.011 3.011 0 000-6.022zm5.043-2.101a1.133 1.133 0 110 2.266 1.133 1.133 0 010-2.266z" />
                            </svg>
                        </a>
                        {/* WhatsApp */}
                        <a
                            href="#"
                            aria-label="WhatsApp"
                            className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center hover:bg-gray-500/40 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-400/40">
                <p className="text-xs text-gray-500 tracking-wide">
                    © {new Date().getFullYear()} Nexoura. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
