"use client";

import Divider from "@/components/Divider"
import Section from "@/components/CardComponent";

export default function Privacy() {
  return (
    <>
      <div>
        <h1 className="text-4xl font-semibold fadeIn animation-delay-400">Privacy</h1>
        <p className="fadeIn animation-delay-800">How we collect, use, and share your data.</p>
        <p className="fadeIn animation-delay-1000 text-sm ">Effective as of the 27th of july 2023.</p>
      </div>

      <Divider height="h-10"/> 

      <div className="grid md:grid-cols-2 gap-10">
        <Section
          title="Introduction"
          type="primary"
          animationDelay="animation-delay-1000"
        >
          <p className="mb-4">
            Welcome to ManagerX.
            We are committed to protecting your privacy and safeguarding your personal information. 
            This Privacy Policy outlines how we collect, use, disclose, and protect your data when you interact with us through our website or use our services.
          </p>
        </Section>
        
        <Section
          title="Data Security"
          type="secondary"
          animationDelay="animation-delay-1200"
        >
          <p>
            We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. 
            These measures include hashing all sensitive information including but not limited to, your username, email address and password, and encrypting all data using a private key which only you have access to.
            However, no data transmission over the internet can be guaranteed as 100% secure, and we cannot guarantee the security of any information you transmit to us.
          </p>
        </Section>
      
        <Section
          title="How We Use Your Information"
          type="secondary"
          animationDelay="animation-delay-1400"
        >
          <p>
            We may use the collected information for various purposes, including but not limited to:
          </p>

          <ul className="list-disc ml-6">
            <li className="mb-2">
              Sending you important updates and notifications related to our services.
            </li>
            <li className="mb-2">
              Personalizing your experience on our website.
            </li>
            <li className="mb-2">
              Analyzing website usage to enhance user experience and improve our content.
            </li>
            <li className="mb-2">
              Responding to your inquiries and providing customer support.
            </li>
          </ul>
        </Section>

        <Section
          title="Disclosure of Your Information"
          type="secondary"
          animationDelay="animation-delay-1600"
        >
          <p>
            We will not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:
          </p>
          <ul className="list-disc ml-6">
            <li className="mb-2">
              Third-Party Service Providers: We may engage third-party service providers to assist us in delivering our services, and they may have access to your personal information on our behalf.
            </li>

            <li className="mb-2">
              Legal Requirements: We may disclose your information if required by law, regulation, or legal process.
            </li>

            <li className="mb-2">
              Protection of Rights: We may disclose your information to protect our rights, privacy, safety, or property, as well as that of our users or others.
            </li>
          </ul>
        </Section>

        <Section
          title="Information We Collect"
          type="secondary"
          animationDelay="animation-delay-1800"
        >
          <p>
            We may collect certain types of personal information when you visit our website or use our services,
            including but not limited to:
          </p>

          <ul className="list-disc ml-6">
            <li className="mb-2">
              Personal Information: Your username, email address, password, and other information you provide voluntarily when registering, filling out forms, or contacting us.
            </li>

          <li className="mb-2">
              Log Data: Information that your browser sends whenever you visit our website, such as your IP address, browser type, device identifiers, pages visited, referring URL, and the date and time of your visit.
            </li>

            <li className="mb-2">
              Cookies and Similar Technologies: We use cookies and similar tracking technologies to enhance your user experience by automatically managing your sessions.
            </li>

            <li className="mb-2">
              Third-Party Sources: We may receive information from third-party sources, such as social media platforms or business partners, in accordance with their privacy policies.
            </li>
          </ul>
        </Section>
      
        <Section
          title="Your Choices"
          type="secondary"
          animationDelay="animation-delay-2000"
        >
          <p>
            You have the right to:
          </p>

          <ul className="list-disc ml-6">
            <li className="mb-2">
              Access and Rectification: Request access to and correction of your personal information.

            </li>
            <li className="mb-2">
              Opt-Out: Unsubscribe from marketing communications and updates.

            </li>
            <li className="mb-2">
              Data Deletion: Request the deletion of your personal information, subject to legal requirements and retention periods.

            </li>
          </ul>
        </Section>

        <Section
          title="Children's privacy"
          type="secondary"
          animationDelay="animation-delay-2000"
        >
          <p>
            Our services are not intended for individuals under the age of 13. 
            We do not knowingly collect personal information from children. 
            If you believe we have inadvertently collected information from a child, please contact us, and we will take steps to remove the data.
          </p>
        </Section>

        <Section
          title="Changes To This Privacy Policy"
          type="secondary"
          animationDelay="animation-delay-2000"
        >
          <p>
            We may update this Privacy Policy from time to time. 
            The latest version will be posted on our website with the updated effective date. 
            Your continued use of our services after any modifications to the Privacy Policy signifies your acceptance of the revised terms.
          </p>
        </Section>


        <Section
          title="Contact Us"
          type="secondary"
          animationDelay="animation-delay-2000"
        >
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
          <br/>
          <span className="text-lg">support@managerx.org</span>
        </Section>
      </div>
    </>
  )
}