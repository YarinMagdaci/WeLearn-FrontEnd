import React from "react";
import { styles } from "../styles/style";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div className="max-h-fit w-[70%] 800px:w-[92%] m-auto py-2 dark:text-white text-black px-3">
      <h1 className={`${styles.title} !text-start pt-2`}>
        We Learn - User Policies
      </h1>

      <section>
        <h2>1. Account Registration</h2>
        <p>
          1.1 To access certain features of the WeLearn, you must register for
          an account.
        </p>
        <p>
          1.2 You are responsible for maintaining the confidentiality of your
          account information, including your username and password.
        </p>
        <p>
          1.3 Any activities that occur under your account are your
          responsibility.
        </p>
      </section>

      <section>
        <h2>2. Code of Conduct</h2>
        <p>
          2.1 Users must conduct themselves in a respectful and professional
          manner within the WeLearn.
        </p>
        <p>
          2.2 Any form of harassment, offensive language, or inappropriate
          behavior will not be tolerated.
        </p>
        <p>
          2.3 Users are expected to respect the intellectual property rights of
          others.
        </p>
      </section>

      <section>
        <h2>3. Content Guidelines</h2>
        <p>
          3.1 Users are prohibited from uploading, sharing, or distributing any
          content that is illegal, infringes on copyrights, or violates any
          laws.
        </p>
        <p>
          3.2 The WeLearn reserves the right to remove any content that violates
          these guidelines without notice.
        </p>
      </section>

      <section>
        <h2>4. Security</h2>
        <p>
          4.1 Users are prohibited from attempting to breach the security of the
          WeLearn, including but not limited to hacking, unauthorized access, or
          any other malicious activities.
        </p>
        <p>
          4.2 Report any security vulnerabilities to our support team promptly.
        </p>
      </section>

      <section>
        <h2>5. System Integrity</h2>
        <p>
          5.1 Users must not attempt to interfere with the proper functioning of
          the WeLearn.
        </p>
        <p>
          5.2 Any attempt to disrupt or disable our systems may result in legal
          action.
        </p>
      </section>

      <section>
        <h2>6. Termination of Account</h2>
        <p>
          6.1 The WeLearn reserves the right to terminate accounts that violate
          these policies without prior notice.
        </p>
        <p>
          6.2 Users may also terminate their accounts at any time by following
          the provided procedures.
        </p>
      </section>

      <section>
        <h2>7. Modifications to Policies</h2>
        <p>
          7.1 The WeLearn reserves the right to update or modify these policies
          at any time.
        </p>
        <p>
          7.2 Users will be notified of any changes, and it is their
          responsibility to review and comply with the updated policies.
        </p>
      </section>

      <p>
        By using our WeLearn, you acknowledge that you have read, understood,
        and agreed to these policies. If you do not agree with any part of these
        terms, please refrain from using our platform.
      </p>

      <p>
        For any questions or concerns, please contact our support team at{" "}
        <a href="mailto:support@WeLearn.com">support@WeLearn.com</a>.
      </p>
    </div>
  );
};

export default Policy;
