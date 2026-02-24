import Link from "next/link"
import styles from "./page.module.css"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Terms of Service</h1>

          <div className={styles.textBody}>
            <p>
              These Terms of Service &quot;Terms&quot; are a binding contract between you and Citadel Protocol (&quot;Citadel&quot;), concerning your access to and use of the Citadel website (the &quot;website&quot;) and the decentralized finance web-hosted interface and dashboard, as well as any other website, community, blog, media form, media channel, or mobile website related, linked, or otherwise connected thereto (each a &quot;Service&quot; and collectively, the &quot;Services&quot;). You must agree to and accept all the Terms, or you won&#39;t have the right to use the &quot;Services&quot;. Your use of the Services in any way means that you agree to all these Terms, and these Terms will remain in force while you use the Services. These Terms refer to the provisions in this document, as well as those in the Privacy and Cookie Policies.
            </p>

            <p>
              By clicking on the &quot;Connect account&quot; button, entering your Ethereum address or ENS domain, and/or browsing, accessing or using any content, information, services, features, or resources available or enabled via the website or the Services, you represent that: (1) you have read, understand, and agree to be bound by the terms of use, (2) you are of legal age to form a binding contract with Citadel, and (3) you have the authority to enter into the terms of use. The term &quot;you&quot; refers to the individual or legal entity, as applicable, that is using or accessing the Services or that is identified as the user when you engaged with the website.
            </p>

            <h2>Nature and extent of the Service</h2>
            <p>
              The Services primarily consist, without limitation, of the Website and Interface, which allow you to connect a digital wallet for cryptocurrencies (&quot;Wallet&quot;) in order to track and monitor a portfolio of cryptocurrencies, including assets, debts, liquidity, pools, staking, claimable rewards and yield farming activities between supported DeFi platforms. Citadel does not offer financial advice, or any other type of advice whatsoever, and the use of our Services is entirely on your own informed and consented risk.
            </p>
            <p>
              Citadel is a non-custodial platform and does not have access to your private key and cannot initiate a transfer of cryptocurrencies or otherwise access your digital currencies or tokens. Citadel is not a broker or intermediary and is in no way your agent, advisor, or custodian, and we do not have a fiduciary relationship or obligation to you regarding any other decisions or activities that you carry out when using your Wallet or our Services. We are not responsible for any activities that you engage in when using your wallet, and you should understand the risks associated with the Decentralized Finance industry and, in general, the blockchain technology and ecosystem.
            </p>
            <p>
              The information and content available in the Services and the Interface (collectively, the &quot;Citadel Property&quot;) are protected by copyright laws throughout the world. Subject to these Terms, Citadel grants you a limited non-exclusive license to reproduce portions of Citadel Property for the sole purpose of using the Services for your personal or internal business purposes. Unless explicitly provided in writing, we do not host or maintain Third-Party decentralized applications accessible on our Services and do not participate in any transactions on such Third-Party decentralized applications, neither we recommend, endorse, or otherwise take a position on your use of these services.
            </p>
            <p>
              You must already have a Wallet to use our Services, since you cannot create a Wallet using our Services. We never have access to any cryptocurrency in your Wallet, we will not store your private keys or similar methods of accessing your Wallet, and we will never request this information.
            </p>
            <p>
              You will be responsible for keeping your hardware devices secure for any activity associated with such devices and your Wallet when using our Services. Citadel will not be responsible if someone else accesses your devices and authorizes any type of transaction.
            </p>
            <p>
              Our services are currently free of charge, but we reserve the right to charge for certain or all Services in the future. We will notify you before charging a fee, and if you wish to continue using our Services, you must pay all applicable fees for such Services. You are the sole owner of the cryptocurrency in your Wallet and may elect to extract your private key or otherwise transfer your cryptocurrency to another Wallet or platform.
            </p>

            <h2>Use of the Services</h2>
            <p>
              You hereby authorize Citadel to receive and/or access all information from your Wallet required by Citadel to provide the Services. You represent that you are entitled to grant Citadel access to your Wallet without breach by you of any of the terms and conditions that govern your use of the Wallet. By granting Citadel access to your Wallet, you understand that Citadel may access and make available and store (if applicable) any information, data, text, software, tags and/or other materials accessible through Citadel Property, as well as personal financial data that you have provided to and/or stored in your Wallet, as applicable (collectively, the &quot;Connected Content&quot;), so that it is available on and through Citadel Property, via your Wallet, while using our Services. Please note that if a Wallet or any associated service becomes unavailable, or Citadel&#39;s access to such Wallet is terminated by you or any third-party service provider, the Connected Content will no longer be available on and through Citadel Property, and the functionality of the Interface and Services may cease.
            </p>
            <p>
              Unless otherwise specified in these Terms, all Connected Content shall be considered to be content of your property. Depending on the Third-Party Accounts you choose, and subject to the privacy settings that you have agreed on and set in such Third-Party Accounts, personally identifiable information that you post to your Third-Party Accounts may be available on and through Citadel Property. You have the ability to disable the connection between the Services and your Wallet or Third-Party Account at any time by logging out of your Wallet or Third-Party Account.
            </p>
            <p>
              Please note that your relationship with any third-party service providers associated with your wallets and third-party accounts is governed solely by your agreement(s) with such third-party service providers, and Citadel disclaims any liability for personally identifiable information that may be provided to it by such third-party service providers in violation of the privacy settings that you have set in such wallets. Citadel makes no effort to review any Connected Content for any purpose, including but not limited to, for accuracy, legality or noninfringement, and Citadel is not responsible for any Connected Content.
            </p>
            <p>
              You must provide all equipment and software necessary to connect to the Citadel Interface and Dashboard, including but not limited to any hardware device required to connect your Wallet. You are solely responsible for any fees, including Internet connection or mobile fees, that you incur when accessing Citadel Property. You will be responsible for keeping your hardware devices secure and for any activity associated with such devices and your Wallet when using our Services. Citadel will not be responsible if someone else accesses your devices and authorizes any transaction while using our Services.
            </p>
            <p>You represent, warrant, and agree that you will not use the Services or interact with the Services in a manner that:</p>
            <ul>
              <li>Violates any law or regulation;</li>
              <li>Is harmful, fraudulent, deceptive, threatening, harassing, defamatory, obscene, or otherwise objectionable;</li>
              <li>Infringes or violates the intellectual property rights or any other rights of anyone else;</li>
              <li>Jeopardizes the security of your Wallet or anyone else&#39;s;</li>
              <li>Attempts, in any manner, to obtain the security information from any other user;</li>
              <li>Attempts to access another user&#39;s Wallet, private key, or other security information on any third-party site or services that provide access to such user&#39;s Wallet or private key on our Services;</li>
              <li>Violates the security of any computer network, or cracks any passwords or encryption codes;</li>
              <li>Uses any manual or automated software, devices, or other processes (including but not limited to spiders, robots, scrapers, crawlers, avatars, data mining tools, or the like) to &quot;scrape&quot; or download data from any web pages contained in the Services; or</li>
              <li>Decompiles, reverse engineers or otherwise attempts to obtain the source code or underlying ideas or information of or relating to the Services.</li>
            </ul>
            <p>
              A violation of any of the foregoing is grounds for termination of your right to use or access the Services to the extent possible. However, in no event do we have the ability to access or suspend your access to your own Wallet, and you are always entitled to use your Wallet on other services.
            </p>

            <h2>Intellectual Property</h2>
            <p>By agreeing to these Terms, you shall not:</p>
            <ul>
              <li>License, sell, rent, lease, transfer, assign, reproduce, distribute, host, or otherwise commercially exploit Citadel Property or any portion thereof;</li>
              <li>Copy, reproduce, distribute, republish, download, display, post, or transmit, in any form or by any means, Citadel Property (except to the extent explicitly allowed by these Terms);</li>
              <li>Frame or utilize framing techniques to enclose any trademark, logo, or other Citadel Property (including images, text, page layout, or form);</li>
              <li>Use any metatags or other hidden text using Citadel&#39;s name, property or trademarks; and</li>
              <li>Modify, translate, adapt, merge, or make derivative works of Citadel Property.</li>
            </ul>
            <p>Any future release, update, or other addition to Citadel Property shall be subject to the Agreement.</p>
            <p>
              The materials displayed, performed or available on or through the Services, including, but not limited to, trademarks, text, graphics, data, articles, photos, images, illustrations, works and so forth are protected by copyright and intellectual property laws. By using our services, you agree to abide by all copyright notices, trademark rules, information and restrictions contained in any content you access through the Services.
            </p>
            <p>
              Except with respect to your Wallet and your content, you agree that Citadel owns all rights, title, and interest in Citadel Property (including but not limited to the Website, Interface, Dashboard, any computer code, themes, objects, designs, concepts, artwork, animations, sounds, musical compositions, audiovisual effects, methods of operation, moral rights, documentation, and Citadel software). You will not remove, alter, or obscure any copyright, trademark, service mark, or other proprietary rights notices incorporated in or accompanying any Citadel Property.
            </p>
            <p>
              You acknowledge that Citadel may use, distribute, reproduce or make available the content you post or generate on social media regarding your use of our Services, including without limitation Twitter posts, mentions on social media accounts, or testimonials, for marketing activities. Hence, you grant Citadel a non-exclusive, worldwide and perpetual license, to use, distribute, reproduce, or make available the texts, images, video, or any other kind of material, posted on social media in which you interact, engage, mention, review, or somehow allude to Citadel, the Citadel Property, and/or the Services, for Citadel&#39;s marketing activities.
            </p>
            <p>
              You acknowledge that the Services may use, incorporate or link to certain open-source components and that your use of the Services is subject to, and you will comply with any, applicable &quot;open source&quot; licenses (&quot;Open Source Software&quot;). Some of the Open Source Software is owned by third parties and each piece of Open Source Software is licensed under the terms of its corresponding end-user license agreement. Nothing in these Terms limits your rights under, or grants you rights that supersede, the terms and conditions of any applicable end-user license agreement for the Open Source Software. If required by any license for particular Open Source Software, Citadel will make such Open Source Software, and Citadel&#39;s modifications to that Open Source Software, available by written request.
            </p>
            <p>
              Citadel and all related graphics, logos, service marks, and trade names used on or in connection with any Citadel Property, or in connection with the Services, are the trademarks of Citadel and may not be used without permission in connection with your or any Third-Party products or services (except to the extent explicitly allowed by these Terms).
            </p>

            <h2>User Conduct</h2>
            <p>As a condition of use, you agree not to use Citadel Property and our Services for any purpose that is prohibited by these Terms and by applicable law. You shall not (and shall not permit any third party) either to (a) take any action or to (b) make available any content on or through Citadel Property that:</p>
            <ul>
              <li>infringes any patent, trademark, trade secret, copyright, right of publicity, or other rights of any person or entity;</li>
              <li>is unlawful, threatening, abusive, harassing, defamatory, libelous, deceptive, fraudulent, invasive of another&#39;s privacy, tortious, obscene, or offensive;</li>
              <li>constitutes unauthorized or unsolicited advertising, junk or bulk e-mail;</li>
              <li>involves commercial activities and/or sales, such as contests, sweepstakes, barter, advertising, or pyramid schemes without Citadel&#39;s prior written consent;</li>
              <li>impersonates any person or entity, including any employee or representative of Citadel;</li>
              <li>interferes with or attempt to interfere with the proper functioning of Citadel Property or uses Citadel Property in any way not expressly permitted by these Terms;</li>
              <li>jeopardizes the security of your Wallet or anyone else&#39;s (such as allowing someone else to log in to the Services as you);</li>
              <li>attempts, in any manner, to obtain the private keys, password, account, or other security information from any other user;</li>
              <li>attempts to access another user&#39;s Wallet, private keys or other security information on any third-party site or services that provide access to such user&#39;s Wallet or private keys on our Services; or</li>
              <li>attempts to engage in or engage in, any potentially harmful acts that are directed against Citadel Property, including but not limited to violating or attempting to violate any security features of Citadel Properties, using manual or automated software or other means to access, &quot;scrape,&quot; &quot;crawl&quot; or &quot;spider&quot; any pages contained in Citadel Property, introducing viruses, worms, or similarly harmful code into Citadel Property, or interfering or attempting to interfere with the use of Citadel Property by any other user, host or network, including by means of overloading, &quot;flooding,&quot; &quot;spamming,&quot; &quot;mail bombing,&quot; or &quot;crashing&quot; Citadel Property.</li>
            </ul>
            <p>
              You agree that submission of any ideas, suggestions, documents, and/or proposals (&quot;Feedback&quot;) to Citadel through Citadel&#39;s official communication channels, included but not limited to, Discord, Telegram, Twitter, Gitcoin, as well as any other available community, fora, or similar pages is at your own risk and that Citadel has no obligations (including without limitation obligations of confidentiality) with respect to such Feedback. You represent and warrant that you have all rights necessary to submit the Feedback. You hereby grant to Citadel a royalty-free, perpetual, irrevocable, worldwide, non-exclusive, and fully sublicensable right and license to use, reproduce, perform, display, distribute, adapt, modify, reformat, create derivative works of, and otherwise commercially or non-commercially exploit in any manner, any and all Feedback, and to sublicense the foregoing rights, in connection with the operation and maintenance of Citadel Property, the Website, Interface, and its Dashboard.
            </p>

            <h2>Links to and from this site</h2>
            <p>
              You may not create a link to any page of this website without our prior written consent. If you do create a link to a page of this website you do so at your own risk and the exclusions and limitations set out above will apply to your use of this website by linking to it.
            </p>
            <p>
              We do not monitor or review the content of other party&#39;s websites which are linked to from this website. Opinions expressed or material appearing on such websites are not necessarily shared or endorsed by us and should not be regarded as the publisher of such opinions or material.
            </p>
            <p>
              Please be aware that we are not responsible for the privacy practices, or content, of these sites. We encourage our users to be aware when they leave our site &amp; to read the privacy statements of these sites. You should evaluate the security and trustworthiness of any other site connected to this site or accessed through this site yourself, before disclosing any personal information to them.
            </p>
            <p>
              Citadel will not accept any responsibility for any loss or damage in whatever manner, howsoever caused, resulting from your disclosure to third parties of personal information.
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold Citadel, its holding companies, subsidiaries, affiliates, officers, employees, agents, partners, suppliers, and licensors (each a &quot;Citadel Party&quot; and collectively the &quot;Citadel Parties&quot;) harmless from any losses, costs, liabilities, and expenses (including reasonable attorneys&#39; fees) relating to or arising out of any and all of the following:
            </p>
            <ul>
              <li>Your Content;</li>
              <li>your use of, or inability to use any Citadel Property;</li>
              <li>your violation of the Terms;</li>
              <li>your violation of any rights of another party; or</li>
              <li>your violation of any applicable laws, rules, or regulations.</li>
            </ul>
            <p>
              Citadel reserves the right, at its own cost, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with Citadel in asserting any available defenses. This provision does not require you to indemnify any of the Citadel Parties for any unconscionable commercial practice by such party or for such party&#39;s fraud, deception, false promise, misrepresentation or concealment, or suppression or omission of any material fact in connection with the Website or any Services provided hereunder. You agree that the provisions in this section will survive any termination of your account, the Terms and/or your use and access to the Citadel Property.
            </p>

            <h2>Assumption of risk</h2>
            <p>
              To be successfully completed, any transaction created with or sent to your Wallet must be confirmed and recorded in a blockchain associated with the relevant cryptocurrency. Citadel has no control over any blockchain and therefore cannot and does not ensure that any transaction details that you submit or receive while using our Services will be confirmed on the relevant blockchain and does not have the ability to facilitate any cancellation or modification requests. In addition, certain Third-Party stakeholders and service providers may involve complex financial transactions that entail a high degree of risk. You accept and acknowledge that you take full responsibility for all activities that occur under your Wallet and accept all risks of loss or any authorized or unauthorized access to your Wallet, to the maximum extent permitted by law.
            </p>
            <p>You further accept and acknowledge that:</p>
            <ul>
              <li>You have the necessary technical expertise and ability to review and evaluate the security, integrity, and operation of your Wallet;</li>
              <li>You have the knowledge, experience, understanding, professional advice, and information to make your own evaluation of the merits, risks, and applicable compliance requirements under applicable laws of any use of your Wallet;</li>
              <li>You know, understand, and accept the risks associated with your Wallet; and</li>
              <li>You accept the risks associated with the Ethereum protocol and, in general, with blockchain transactions, and you are responsible for conducting your own independent analysis and research of the risks specifically associated with Decentralized Finance. You further agree that Citadel has no responsibility or liability for such risks. You hereby irrevocably waive, release, and discharge all claims, whether known or unknown to you, against Citadel, its affiliates, and their respective shareholders, members, directors, officers, employees, agents, and representatives related to any of the risks set forth herein.</li>
            </ul>
            <p>
              The prices of blockchain assets are extremely volatile. Citadel makes no warranties as to the markets in which cryptocurrency is transferred, purchased, or traded.
            </p>
            <p>
              You are solely responsible for determining what, if any, taxes apply to your blockchain transactions. Citadel is not responsible for determining the taxes that apply to blockchain transactions or your use of the Services.
            </p>
            <p>
              Citadel does not store, send, or receive Ether (Ethereum&#39;s cryptocurrency or &quot;ETH&quot;) or funds. This is because Ether exists only by virtue of the ownership record maintained on its supporting Ethereum blockchain. Any transfer of Ether occurs within the supporting blockchain and not in the Services. The transaction details you submit via the Services may not be completed or may be substantially delayed, by the relevant blockchain used to process the transaction. Once transaction details have been submitted to a blockchain, Citadel cannot cancel or otherwise modify your transaction or transaction details. There are no warranties or guarantees that a transfer initiated on your behalf through Third-Party&#39;s services will successfully transfer title or right in any Ether.
            </p>
            <p>
              There are risks associated with using an Internet-based currency, including but not limited to, the risk of hardware, software, and Internet connections, the risk of malicious software introduction, and the risk that third parties may obtain unauthorized access to information stored within your Wallet. You accept and acknowledge that Citadel will not be responsible for any communication failures, disruptions, errors, distortions or delays, or losses you may experience when using Ethereum or any other blockchain, however caused.
            </p>
            <p>
              The regulatory regime governing blockchain technologies, cryptocurrencies, and tokens is uncertain and constantly changing. Thus, new regulations or policies may materially adversely affect the development of the Services and the utility of Ether.
            </p>
            <p>
              Citadel makes no guarantee as to the functionality of any blockchain&#39;s decentralized governance, which could, among other things, lead to delays, conflicts of interest, or operational decisions that are unfavorable to certain owners of Ether. You acknowledge and accept that the protocols governing the operation of a blockchain may be subject to sudden changes in operating rules which may materially alter the blockchain and affect the value and function of Ether evidenced on that blockchain.
            </p>
            <p>
              You acknowledge that, in light of the nature of blockchain technology and Decentralized Finance, Citadel makes no guarantee as to the security of any blockchain. Citadel is not liable for any hacks, double spending, stolen cryptocurrency, or any other attacks on a blockchain.
            </p>
            <p>
              The Services rely on, and Citadel makes no guarantee or warranties as to, the functionality of or access to any, Third-Party Wallet platforms and ecosystem stakeholders and service providers to perform any transactions.
            </p>
            <p>
              By using our Services, you acknowledge and accept that there are substantial risks associated with cryptocurrency and transactions on the Ethereum network. Specifically, you agree and understand that:
            </p>
            <ul>
              <li>The loss or destruction of a hardware device you have used our Services on may compromise the security of your Wallet and may result in loss of cryptocurrency.</li>
              <li>The transaction details you submit via the Services may not be completed or may be substantially delayed on the Ethereum network and Citadel takes no responsibility for the failure of a transaction to be confirmed or processed as expected.</li>
              <li>There are no warranties or guarantees that a transfer initiated on Third-Party platforms will successfully transfer title or right in any cryptocurrency.</li>
              <li>Citadel is not a counterparty or participant to any transaction you make while using our Services. Further, once transaction details have been submitted to the Ethereum network, Citadel cannot assist you to cancel or otherwise modify your transaction or transaction details.</li>
            </ul>
            <p>
              As a mere software services provider, Citadel is not regulated by any federal or state regulatory agency and is not subject to the examination or reporting requirements of any such agencies.
            </p>
            <p>
              The application of existing legal and regulatory requirements to cryptocurrency and our Services is developing and evolving. Citadel may rely on the advice of counsel concerning the application of existing and new legal and regulatory requirements to its activities. This advice may require us to make sudden changes to our Services that may impact your ability to use our Services.
            </p>
            <p>
              You acknowledge and accept that the protocols governing the operation of the Ethereum network or decentralized applications may be subject to sudden changes in operating rules which may materially alter the network, affect the value and function of a particular cryptocurrency, or otherwise render you unable to use our Services. Citadel does not assume responsibility for fundamental advancements in cryptography, or any other underlying technology, which could render inoperative cryptographic algorithms utilized by certain decentralized applications or the Ethereum network.
            </p>
            <p>
              Citadel is not a party to or responsible for any illegal activity or use of cryptocurrency through our Services or for any illegal transfers requested or authorized with your Wallet while using our Services.
            </p>

            <h2>Disclaimer of Warranties</h2>
            <p>
              You expressly understand and agree that, to the extent permitted by applicable law, your use of Citadel Property is at your sole risk, and Citadel Property is provided on an &quot;as is&quot; and &quot;as available&quot; basis, with all possible faults. Citadel parties expressly disclaim all warranties, representations, and conditions of any kind, whether express or implied, including, but not limited to, the implied warranties or conditions of merchantability, fitness for a particular purpose, and non-infringement arising from the use of the website. Citadel parties make no warranty, representation, or condition that: (1) Citadel Property will meet your requirements; (2) your use of the Citadel Property will be uninterrupted, timely, secure, or error-free; and that (3) the results that may be obtained from the use of Citadel Property will be accurate or reliable.
            </p>
            <p>
              Any content downloaded from or otherwise accessed through the Citadel Property is accessed at your own risk, and you shall be solely responsible for any damage to your property, including, but not limited to, your computer system and any device you use to access the Citadel Property or any other loss that results from accessing such content. The services may be subject to delays, cancellations, and other disruptions. Citadel makes no warranty, representation, or condition with respect to services, including but not limited to, the quality, effectiveness, reputation, and other characteristics of services. No advice or information, whether oral or written, obtained from Citadel or through the Citadel Property will create any warranty not expressly made herein.
            </p>
            <p>
              You acknowledge and agree that Citadel parties are not liable, and you agree not to seek to hold Citadel parties liable, for the conduct of Third-Parties, including operators of external sites, and that the risk of injury from such Third-Parties rests entirely with you. Citadel makes no warranty that the goods or services provided by Third-Parties will meet your requirements or be available on an uninterrupted, secure, or error-free basis. Citadel makes no warranty regarding the quality of any such goods or services or the accuracy, timeliness, truthfulness, completeness, or reliability of any connected content obtained through the Citadel Property.
            </p>
            <p>
              Notwithstanding anything to the contrary in these Terms of Use, Citadel shall be under no obligation to inquire into and shall not be liable for any damages, other liabilities or harm to any person or entity relating to (i) the ownership, validity, or genuineness of any Ethereum blockchain or transaction; (ii) the collectability, insurability, effectiveness, marketability or suitability of any Ethereum blockchain or transaction; or (iii) any losses, delays, failures, errors, interruptions or loss of data occurring directly or indirectly by reason of circumstances beyond Citadel&#39;s control, including without limitation the failure of a blockchain or a Third-Party services provider.
            </p>
            <p>
              For clarity purposes, there is an error if you are not able to access the Service or a material function in the Service, and this is caused by circumstances which are under our responsibility. You acknowledge that errors might occur from time to time and, therefore, you waive any right to claim for compensation due to errors in the Service. If an error occurs, you shall notify Citadel of the error and provide a description of the error situation. Citadel shall use reasonable commercial efforts to correct the error within a reasonable time. If requested by Citadel, you shall provide us with necessary assistance in order to reproduce/identify the error situation. We are not liable for any errors as a result of change of data structure when a new version of the Service is released.
            </p>
            <p>
              Our Services are constantly evolving, so they may change over time. We may suspend or discontinue any part of the Services, or we may introduce new features, impose limits on certain features or restrict access to parts or all the Services. We reserve the right to remove any Content from the Services at any time, for any reason in our sole discretion, and without notice.
            </p>
            <p>
              Certain types of Service maintenance may imply a stop or reduction in the availability of the Services. Citadel does not warrant any particular level of Service availability, but will provide its best effort to notify you and limit the impact of any programmed maintenance on the availability of the Service.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              You understand and agree that, to the fullest extent provided by law, in no event shall Citadel parties be liable for any loss of profits, Ether or other cryptocurrency, revenue, digital assets or data, indirect, incidental, special, or consequential damages, or damages or costs due to loss of production or use, business interruption, or procurement of substitute goods or services, in each case whether or not Citadel has been advised of the possibility of such damages, arising out of or in connection with the agreement or any communications, interactions or meetings with other users of the Citadel Property, on any theory of liability, resulting from: (a) the use or inability to use the Citadel Property; (b) the cost of procurement of substitute goods or services resulting from any goods, data, information or services purchased or obtained; or messages received for transactions entered into while using the Citadel Property; (c) unauthorized access to or alteration of your transmissions or data; (d) statements or conduct of any Third-Party on Citadel properties; or (e) any other matter related to the Citadel Property, whether based on warranty, copyright, contract, tort (including negligence), product liability or any other legal theory. The foregoing limitation of liability shall not apply to a Citadel Party for (i) death or personal injury caused by a Citadel Party&#39;s negligence; or for (ii) any injury caused by a Citadel party&#39;s fraud or fraudulent misrepresentation.
            </p>
            <p>
              To the fullest extent provided by law, Citadel parties will not be liable to you for more than the greater of (a) $100 USD; or (b) the remedy or penalty imposed by the statute under which such claim arises. The foregoing cap on liability shall not apply to the liability of a Citadel party for (i) death or personal injury caused by a Citadel party&#39;s negligence, or for (ii) any injury caused by a Citadel party&#39;s fraud or fraudulent misrepresentation.
            </p>
            <p>
              Certain jurisdictions do not allow the exclusion or limitation of certain damages. If these laws apply to you, some or all the above exclusions or limitations may not apply to you, and you might have additional rights.
            </p>
            <p>
              The limitations of damages set forth above are fundamental elements of the basis of the bargain between Citadel and you.
            </p>

            <h2>Privacy</h2>
            <p>
              We take the privacy of our users very seriously. Thus, we protect our users&#39; private information through a general policy of sharing information only as long as is necessary to provide our Services unless they otherwise consent to additional sharing. To view our current Privacy Policy and privacy practices, please click here.
            </p>
            <p>
              Our users&#39; records are confidential and will not be divulged to any third party. Citadel will not sell, share, or rent your personal information to any third party. Any emails sent by us will only be in connection with the provision of the Services.
            </p>

            <h2>Changes to the Terms of Service</h2>
            <p>
              We are constantly improving our Services, so we may need to change these Terms along with the Services. We reserve the right to change the Terms at any time, but if we do, we will bring it to your attention by requiring you to log in to our Services again and accept the new Terms, and/or by some other means.
            </p>
            <p>
              If you don&#39;t agree with the new Terms, you are free to reject them. Unfortunately, that means you will no longer be able to use the Services. If you use the Services in any way after a change to the Terms is effective, that means you agree to all of the changes.
            </p>
            <p>
              New versions of the Service might be released without any notification prior to the release. You may need to update Third-Party software from time to time in order to use Citadel Property.
            </p>

            <h2>Termination</h2>
            <p>
              The Terms commence on the date when you accept them (as described in the preamble above) and remain in full force and effect while you use the Citadel Property, unless terminated earlier in accordance with the foregoing.
            </p>
            <p>
              Citadel is free to terminate (or suspend access to) your use of the Services for any reason at our discretion, including your breach of these Terms. Citadel has the sole right to decide whether you are in violation of any of the restrictions set forth in these Terms. If we suspend your use of the Services, you may continue to access your Wallet directly or through other services not hosted by us. Citadel will not have any liability whatsoever to you for any suspension or termination.
            </p>
            <p>
              If you want to terminate the Services provided by Citadel, you may do so by logging out of all of the Services that you use at any time. You may continue to access your Wallet directly or through other services not hosted by us.
            </p>
            <p>
              All provisions of the Agreement which by their nature should survive shall survive termination of Services, including without limitation, ownership provisions, warranty disclaimers, and limitation of liability.
            </p>
            <p>
              If your ability to access the Citadel Property or any other Citadel community or social media is discontinued by Citadel due to your violation of any portion of the Terms or for conduct otherwise inappropriate for the community, then you agree that you shall not attempt to access the Citadel Property or any Citadel community or social media through use of a different Wallet, Third-Party Account, member name or otherwise. In the event of a breach to the above, Citadel may, in its sole discretion, immediately take any or all of the actions set forth herein without any notice or warning to you.
            </p>

            <h2>International Presence</h2>
            <p>
              The Citadel Property can be accessed from countries around the world and may contain references to Services and Content that are not available in your country. These references do not imply that Citadel intends to announce such Services or Content in your country. Citadel makes no representations that the Citadel Property is appropriate or available for use in all locations. Those who access or use the Citadel Property from other countries do so at their own desire and are responsible for compliance with local law.
            </p>

            <h2>Dispute Resolution (Arbitration Agreement)</h2>
            <p>
              You agree that any dispute, claim, or request for relief relating in any way to your access or use of the Services or Citadel Property, to any products used or distributed through the Services or Citadel Property, or to any aspect of your relationship with Citadel, will be resolved by binding arbitration, rather than in court, except that (a) you may assert claims or seek relief in small claims court if your claims qualify; and (b) you or Citadel may seek equitable relief in court for infringement or misuse of intellectual property rights (such as trademarks, trade dress, domain names, trade secrets, copyrights, and patents). This Arbitration provision shall also apply, without limitation, to all disputes or claims and requests for relief that arose or were asserted before the effective date of the Terms.
            </p>
            <p>
              You waive any constitutional and statutory rights to sue in court and have a trial in front of a judge or a jury. You and Citadel are instead electing that all disputes, claims, or requests for relief shall be resolved by arbitration submitted to the WIPO Arbitration and Mediation Center. Any dispute, controversy or claim arising under, out of or relating to these Terms and any subsequent amendments, including, without limitation, its formation, validity, binding effect, interpretation, performance, breach or termination, as well as non-contractual claims, shall be referred to and finally determined by arbitration in accordance with the WIPO Expedited Arbitration Rules. The place of arbitration shall be the British Virgin Islands. The language to be used in the arbitral proceedings shall be English. The dispute, controversy or claim shall be decided in accordance with the law of the British Virgin Islands.
            </p>
            <p>
              An arbitrator can award on an individual basis the same damages and relief as a court and must follow these Terms as a court would. However, there is no judge or jury in arbitration, and court review of an arbitration award is subject to very limited review.
            </p>
            <p>
              The arbitrator shall have exclusive authority to (a) determine the scope and enforceability of this Arbitration Agreement and (b) resolve any dispute related to the interpretation, applicability, enforceability or formation of this Arbitration Agreement including, but not limited to, any assertion that all or any part of this Arbitration Agreement is void or voidable. The arbitration will decide the rights and liabilities, if any, of you and Citadel. The arbitration proceeding will not be consolidated with any other matters or joined with any other cases or parties. The arbitrator shall have the authority to grant motions dispositive of all or part of any claim. The arbitrator shall issue a written award and statement of decision describing the essential findings and conclusions on which the award is based, including the calculation of any damages awarded. The arbitrator has the same authority to award relief on an individual basis that a judge in a court of law would have. The award of the arbitrator is final and binding upon you and us.
            </p>
            <p>
              All disputes, claims, and requests for relief within the scope of this arbitration agreement must be arbitrated on an individual basis and not on a class or collective basis, only individual relief is available, and claims of more than one customer or user cannot be arbitrated or consolidated with those of any other customer or user. If a decision is issued stating that applicable law precludes enforcement of any of this section&#39;s limitations as to a given dispute, claim, or request for relief, then such aspect must be severed from the arbitration and brought into the appropriate Courts. All other disputes, claims, or requests for relief shall be arbitrated.
            </p>
            <p>
              If any part or parts of this Arbitration clause are found under the law to be invalid or unenforceable, then such specific part or parts shall be of no force and effect and shall be severed and the remainder of the Arbitration provisions shall continue in full force and effect.
            </p>
            <p>
              This Arbitration Agreement will survive the termination of your relationship with Citadel.
            </p>

            <h2>Miscellaneous Provisions</h2>
            <p>
              The communications between you and Citadel may take place via electronic means, whether you visit Citadel Property, official communication channels, send Citadel e-mails, or whether Citadel posts notices on the Citadel Property. You agree that all terms and conditions, agreements, notices, disclosures, and other communications that Citadel provides to you can and will be made electronically through Citadel Property and/or Citadel official communication channels, and that those communications satisfy any legal requirement that such communications would satisfy if it were to be in writing.
            </p>
            <p>
              You hereby release the Citadel Parties and their successors from claims, demands, any and all losses, damages, rights, and actions of any kind, including personal injuries, death, and property damage, that is either directly or indirectly related to or arises from your use of the Citadel Property, including but not limited to, any interactions with or conduct of other Users or Third-Party websites of any kind arising in connection with or as a result of these Terms or your use of the Citadel Property.
            </p>
            <p>
              These Terms, and your rights and obligations hereunder, may not be assigned, subcontracted, delegated, or otherwise transferred by you without Citadel&#39;s prior written consent, and any attempted assignment, subcontract, delegation, or transfer in violation of the foregoing will be null and void.
            </p>
            <p>
              Citadel shall not be liable for any delay or failure to perform resulting from causes outside its reasonable control, including, but not limited to, acts of God, war, terrorism, riots, embargos, acts of civil or military authorities, fire, floods, accidents, sanitary and health threats, strikes or shortages of transportation facilities, fuel, energy, labor, materials or any other uncontrolled risks.
            </p>
            <p>
              If you have any questions, complaints or claims with respect to the Citadel Property, please contact us at: support@citadel-protocol.com. We will do our best to address your concerns.
            </p>
            <p>
              To the extent the parties are permitted under these Terms to initiate litigation in a court, both you and Citadel agree that all claims and disputes arising out of or relating to these Terms will be litigated exclusively in the state or federal courts located in the British Virgin Islands.
            </p>
            <p>
              The terms and any action related thereto will be governed and interpreted by and under the laws of the British Virgin Islands, without giving effect to any principles that provide for the application of the law of another jurisdiction. The United Nations Convention on Contracts for the International Sale of Goods does not apply to the agreement.
            </p>
            <p>
              Any waiver or failure to enforce any provision of these Terms on one occasion will not be deemed a waiver of any other provision or of such provision on any other occasion.
            </p>
            <p>
              If any portion of these Terms is held invalid or unenforceable, that portion shall be construed in a manner to reflect, as nearly as possible, the original intention of the parties, and the remaining portions shall remain in full force and effect.
            </p>
            <p>
              You may not use, export, import, or transfer the Citadel Property except as authorized by these Terms.
            </p>
            <p>
              These Terms are final, complete, and enact the exclusive agreement of the parties with respect to the subject matter hereof and supersedes and merges all prior discussions and covenants between the parties with respect to such subject matter.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
