import Navigation from "@/components/Navigation";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-muted-foreground">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">1. Introduction</h2>
              <p>
                Freedom Coast Luxury Realty ("we," "us," or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us, including but not limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information (email address, phone number, mailing address)</li>
                <li>Investment preferences and property interests</li>
                <li>Location and relocation information</li>
                <li>Communication preferences</li>
                <li>Any other information you choose to provide through contact forms or direct communication</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect certain information about your device and usage, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To respond to your inquiries and provide real estate services</li>
                <li>To send you property listings and market updates that match your interests</li>
                <li>To schedule consultations and property viewings</li>
                <li>To communicate with you about our services</li>
                <li>To improve our website and user experience</li>
                <li>To comply with legal obligations and protect our rights</li>
                <li>To prevent fraud and enhance security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">4. Information Sharing and Disclosure</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              
              <h3 className="text-xl font-semibold mb-3">4.1 Service Providers</h3>
              <p>We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email service providers</li>
                <li>Website hosting and analytics services</li>
                <li>Calendar and scheduling services</li>
                <li>CRM and database management services</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Legal Requirements</h3>
              <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Business Transfers</h3>
              <p>If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure server infrastructure</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication procedures</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">6. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve website functionality and performance</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
              <p className="mt-4">
                You can control cookie preferences through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">7. Your Rights and Choices</h2>
              <p>You have the following rights regarding your personal information:</p>
              
              <h3 className="text-xl font-semibold mb-3">7.1 Access and Correction</h3>
              <p>You have the right to access and update your personal information. You may request a copy of the personal information we hold about you.</p>

              <h3 className="text-xl font-semibold mb-3 mt-6">7.2 Deletion</h3>
              <p>You may request that we delete your personal information, subject to certain legal exceptions.</p>

              <h3 className="text-xl font-semibold mb-3 mt-6">7.3 Opt-Out</h3>
              <p>You can opt out of receiving marketing communications from us at any time by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clicking the "unsubscribe" link in our emails</li>
                <li>Contacting us directly at julie@nyrefugee.com</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">7.4 Data Portability</h3>
              <p>You may request a copy of your personal information in a structured, commonly used, and machine-readable format.</p>

              <p className="mt-4">
                To exercise any of these rights, please contact us using the information provided in Section 11.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites, including Calendly for appointment scheduling. We are not responsible for the privacy practices of these external sites. We encourage you to read the privacy policies of any third-party websites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">9. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete that information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">11. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-muted rounded-lg">
                <p className="font-semibold">Freedom Coast Luxury Realty</p>
                <p className="mt-2">Email: <a href="mailto:julie@nyrefugee.com" className="text-primary hover:underline">julie@nyrefugee.com</a></p>
              </div>
            </section>

            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">12. State-Specific Privacy Rights</h2>
              
              <h3 className="text-xl font-semibold mb-3">12.1 California Residents (CCPA)</h3>
              <p>
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to know what personal information we collect, use, and disclose</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to opt-out of the sale of personal information (we do not sell personal information)</li>
                <li>The right to non-discrimination for exercising your CCPA rights</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">12.2 Florida Residents</h3>
              <p>
                Florida residents have the right to be informed about how their personal information is collected and used, consistent with Florida's data privacy laws.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">12.3 New York Residents</h3>
              <p>
                New York residents are entitled to transparency regarding data collection practices and have the right to request information about data breaches that may affect them.
              </p>
            </section>

            <div className="mt-12 p-6 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground">
                By using our website and services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
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

export default Privacy;
