import Navigation from "@/components/Navigation";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-muted-foreground">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">1. Acceptance of Terms</h2>
              <p>
                Welcome to Freedom Coast Luxury Realty. By accessing or using our website, services, or communications, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
              </p>
              <p className="mt-4">
                These Terms constitute a legally binding agreement between you and Freedom Coast Luxury Realty ("Company," "we," "us," or "our"). We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting to our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">2. Services Description</h2>
              <p>
                Freedom Coast Luxury Realty provides real estate brokerage services, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Property listings and marketing services</li>
                <li>Buyer and seller representation</li>
                <li>Market analysis and consultation</li>
                <li>Relocation assistance and guidance</li>
                <li>Property viewing coordination</li>
                <li>Real estate investment advice</li>
              </ul>
              <p className="mt-4">
                Our services are provided "as is" and we reserve the right to modify, suspend, or discontinue any aspect of our services at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">3. No Guarantee of Results</h2>
              <p>
                While we strive to provide excellent real estate services, we make no guarantees regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The sale or purchase of any specific property</li>
                <li>Timing of real estate transactions</li>
                <li>Property values, appreciation, or market conditions</li>
                <li>Investment returns or financial outcomes</li>
                <li>Tax benefits or legal advantages of any transaction</li>
              </ul>
              <p className="mt-4">
                Real estate transactions involve significant financial decisions and inherent risks. You are solely responsible for conducting your own due diligence and seeking independent professional advice before making any real estate or financial decision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">4. Property Information Accuracy</h2>
              <p>
                All property information, including descriptions, photographs, prices, square footage, and features, is provided by third parties (property owners, sellers, MLS services, or other sources) and is believed to be accurate but is not guaranteed.
              </p>
              <p className="mt-4">
                We disclaim all liability for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Inaccuracies in property listings or descriptions</li>
                <li>Changes in property status, pricing, or availability</li>
                <li>Errors in square footage, lot size, or property features</li>
                <li>Undisclosed property defects or conditions</li>
                <li>Zoning, permit, or legal restrictions</li>
              </ul>
              <p className="mt-4">
                You are responsible for independently verifying all property information through inspections, surveys, title searches, and other appropriate due diligence measures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">5. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Freedom Coast Luxury Realty, its officers, directors, employees, and agents shall not be liable for any:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Direct, indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Property damage or personal injury</li>
                <li>Financial losses from real estate transactions</li>
                <li>Errors, omissions, or inaccuracies in information provided</li>
                <li>Actions or omissions of third parties (sellers, buyers, inspectors, lenders, etc.)</li>
                <li>Market conditions, property values, or investment performance</li>
              </ul>
              <p className="mt-4">
                Our total liability to you for any claim arising from your use of our services shall not exceed the amount of commissions or fees actually paid to us by you for the specific transaction in question.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">6. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Freedom Coast Luxury Realty, its officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use or misuse of our services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Any real estate transaction in which we represent you</li>
                <li>Your breach of any representation, warranty, or covenant</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">7. User Conduct and Responsibilities</h2>
              <p>
                When using our services, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Conduct yourself in a professional and respectful manner</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Obtain appropriate financing and legal documentation</li>
                <li>Honor all contractual commitments and deadlines</li>
                <li>Respect the privacy and property rights of others</li>
              </ul>
              <p className="mt-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use our services for any unlawful purpose</li>
                <li>Misrepresent your financial qualifications or intentions</li>
                <li>Interfere with or disrupt our services</li>
                <li>Copy, reproduce, or redistribute our content without permission</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">8. Professional Advice Disclaimer</h2>
              <p>
                Freedom Coast Luxury Realty provides real estate brokerage services only. We do not provide:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Legal advice (consult a real estate attorney)</li>
                <li>Tax advice (consult a tax professional or CPA)</li>
                <li>Financial planning advice (consult a financial advisor)</li>
                <li>Home inspection services (hire a licensed inspector)</li>
                <li>Title examination services (use a title company)</li>
                <li>Appraisal services (hire a licensed appraiser)</li>
                <li>Surveying services (hire a licensed surveyor)</li>
              </ul>
              <p className="mt-4">
                You are strongly encouraged to seek independent professional advice from qualified experts in these areas before making any real estate decision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">9. Third-Party Services and Links</h2>
              <p>
                Our website may contain links to third-party websites, services, or resources (including but not limited to Calendly for appointment scheduling, lenders, inspectors, attorneys, and other service providers).
              </p>
              <p className="mt-4">
                We do not endorse, control, or assume responsibility for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The content, privacy policies, or practices of third-party websites</li>
                <li>The quality, reliability, or performance of third-party services</li>
                <li>Any transactions between you and third-party providers</li>
                <li>Any damages or losses caused by third-party services</li>
              </ul>
              <p className="mt-4">
                Your use of third-party services is at your own risk and subject to their terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">10. Intellectual Property Rights</h2>
              <p>
                All content on our website, including text, graphics, logos, photographs, videos, and software, is the property of Freedom Coast Luxury Realty or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mt-4">
                You may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copy, reproduce, or distribute our content without written permission</li>
                <li>Modify, create derivative works, or reverse engineer our materials</li>
                <li>Use our trademarks, logos, or branding without authorization</li>
                <li>Remove copyright or proprietary notices from any content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">11. Agency Relationships and Disclosure</h2>
              <p>
                Our agency relationships are governed by applicable state real estate laws. Prior to entering into any real estate transaction, we will provide you with appropriate agency disclosure forms as required by law.
              </p>
              <p className="mt-4">
                Key points regarding agency relationships:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We may represent buyers, sellers, or both parties (with proper disclosure)</li>
                <li>Different agents in our firm may represent different parties to the same transaction</li>
                <li>We owe fiduciary duties to our clients as defined by law</li>
                <li>Compensation arrangements do not determine agency relationships</li>
                <li>You have the right to choose your own representation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">12. Fair Housing and Non-Discrimination</h2>
              <p>
                Freedom Coast Luxury Realty is committed to compliance with all federal, state, and local fair housing laws. We do not discriminate on the basis of race, color, religion, sex, handicap, familial status, national origin, sexual orientation, or any other protected class.
              </p>
              <p className="mt-4">
                We expect all clients, partners, and users of our services to respect fair housing principles and comply with all applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">13. Data and Communications</h2>
              <p>
                By using our services, you consent to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Receive communications from us via email, phone, text, or mail</li>
                <li>Our collection and use of your information as described in our Privacy Policy</li>
                <li>Electronic delivery of documents and disclosures</li>
                <li>Recording of phone conversations for quality and training purposes</li>
              </ul>
              <p className="mt-4">
                You may opt out of marketing communications at any time by following the unsubscribe instructions in our emails or contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">14. Termination of Services</h2>
              <p>
                We reserve the right to terminate or suspend your access to our services at any time, with or without cause or notice, for any reason including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violation of these Terms</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Non-payment of fees or commissions owed</li>
                <li>Breach of contract or fiduciary duties</li>
                <li>At our sole discretion</li>
              </ul>
              <p className="mt-4">
                Upon termination, all rights granted to you under these Terms will immediately cease, and you must discontinue use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">15. Dispute Resolution and Arbitration</h2>
              <p>
                Any dispute, claim, or controversy arising out of or relating to these Terms or our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law.
              </p>
              <p className="mt-4">
                Key arbitration terms:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Arbitration shall be conducted in Florida</li>
                <li>The arbitrator's decision shall be final and binding</li>
                <li>Each party shall bear its own costs and attorneys' fees unless otherwise awarded</li>
                <li>You waive the right to participate in class action lawsuits</li>
                <li>Small claims court actions are exempt from this arbitration requirement</li>
              </ul>
              <p className="mt-4">
                This arbitration provision does not apply to disputes that cannot be arbitrated under applicable law, including certain disputes related to real estate brokerage relationships governed by state licensing laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">16. Governing Law and Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. Any legal action or proceeding not subject to arbitration shall be brought exclusively in the state or federal courts located in Florida, and you consent to the personal jurisdiction of such courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">17. Severability</h2>
              <p>
                If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving the intent of the original provision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">18. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and any written agreements signed between you and Freedom Coast Luxury Realty, constitute the entire agreement between you and us regarding the use of our services and supersede all prior or contemporaneous communications, whether electronic, oral, or written.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">19. Contact Information for Legal Notices</h2>
              <p>
                All legal notices, claims, or communications regarding these Terms should be sent to:
              </p>
              <div className="mt-4 p-6 bg-muted rounded-lg">
                <p className="font-semibold">Freedom Coast Luxury Realty</p>
                <p className="mt-2">Email: <a href="mailto:julie@nyrefugee.com" className="text-primary hover:underline">julie@nyrefugee.com</a></p>
                <p>Phone: <a href="tel:+1-650-229-4964" className="text-primary hover:underline">650-229-4964</a></p>
              </div>
            </section>

            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">20. State-Specific Provisions</h2>
              
              <h3 className="text-xl font-semibold mb-3">20.1 Florida</h3>
              <p>
                If you are a Florida resident or the property is located in Florida, the following additional terms apply:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We are licensed real estate brokers in the State of Florida</li>
                <li>All real estate transactions are subject to Florida real estate licensing laws</li>
                <li>You have the right to file complaints with the Florida Real Estate Commission</li>
                <li>Specific disclosure requirements apply to designated sales associates and transaction brokers</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">20.2 New York</h3>
              <p>
                For clients relocating from New York, we provide information and assistance but do not practice real estate brokerage in New York. All New York-based transactions must be handled by New York-licensed brokers.
              </p>
            </section>

            <div className="mt-12 p-6 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>IMPORTANT:</strong> By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These Terms contain important limitations on our liability and require binding arbitration of disputes. If you do not agree to these Terms, do not use our services.
              </p>
            </div>

            <div className="mt-8 p-6 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Professional Licensing:</strong> Freedom Coast Luxury Realty operates under applicable state real estate licensing laws. License information and professional credentials are available upon request.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Freedom Coast Luxury Realty. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
