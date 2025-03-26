import React from 'react';

const faqs = [
  {
    question: "What types of schemes does BIDA manage?",
    answer: "BIDA manages various housing schemes, commercial properties, and land development projects. These include both old schemes (pre-2000) and new schemes with different payment models like rental and EMI."
  },
  {
    question: "How can I track my property payments?",
    answer: "After logging into the system, you can access your property details including payment history, pending payments, and upcoming EMIs or rental dues."
  },
  {
    question: "What documents are required for property registration?",
    answer: "Required documents typically include identity proof, address proof, and relevant payment receipts. Specific requirements may vary based on the scheme type."
  },
  {
    question: "How are old schemes different from new schemes?",
    answer: "Old schemes (pre-2000) have different payment structures and management policies compared to new schemes. New schemes often include EMI and rental payment options."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about BIDA's property management system
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}