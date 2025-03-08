/**
 * CivIQ - A civic discourse platform
 * Copyright (c) 2025 CivIQ Foundation
 * 
 * This software is licensed under the CivIQ Ethical Licensing Agreement,
 * based on the Hippocratic License with additional provisions.
 * See LICENSE.md and TERMS_OF_USE.md for full details.
 * 
 * By using this software, you agree to uphold CivIQ's mission of fostering
 * meaningful, evidence-based discussions and combating misinformation.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

/**
 * Home page component
 * Serves as the landing page for the CivIQ platform
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>CivIQ - A Civic Discourse Platform</title>
        <meta name="description" content="CivIQ is a civic discourse platform designed to foster meaningful, evidence-based discussions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to CivIQ
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A platform designed to foster meaningful, evidence-based discussions and combat misinformation.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <span className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                  Get started
                </span>
              </Link>
              <Link href="/about">
                <span className="text-sm font-semibold leading-6 text-gray-900">
                  Learn more <span aria-hidden="true">→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Evidence-Based Discourse</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why CivIQ is different
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                CivIQ is designed from the ground up to promote factual, constructive discussions while preventing toxic behavior and misinformation.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      {/* Icon placeholder */}
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    Identity Verification
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Our platform uses advanced fingerprinting technology to prevent bots and reduce multiple account abuse.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      {/* Icon placeholder */}
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Content Ranking
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Our algorithm prioritizes content based on quality and evidence, not just engagement or virality.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      {/* Icon placeholder */}
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    Intelligent Moderation
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Context-aware moderation prevents toxicity while still allowing robust debate and disagreement.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      {/* Icon placeholder */}
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    Reputation System
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Users build reputation through constructive contributions, creating incentives for quality discourse.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <nav className="flex justify-center space-x-12">
            <Link href="/about">
              <span className="text-sm leading-6 text-gray-600 hover:text-gray-900">About</span>
            </Link>
            <Link href="/terms">
              <span className="text-sm leading-6 text-gray-600 hover:text-gray-900">Terms</span>
            </Link>
            <Link href="/privacy">
              <span className="text-sm leading-6 text-gray-600 hover:text-gray-900">Privacy</span>
            </Link>
            <Link href="/code-of-conduct">
              <span className="text-sm leading-6 text-gray-600 hover:text-gray-900">Code of Conduct</span>
            </Link>
          </nav>
          <p className="mt-10 text-center text-xs leading-5 text-gray-500">
            &copy; 2025 CivIQ Foundation. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}