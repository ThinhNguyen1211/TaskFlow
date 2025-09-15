const Contact = () => {
    const contactMethods = [
      {
        icon: '💼',
        title: 'LinkedIn',
        description: 'Connect with me professionally',
        value: 'Thịnh Nguyễn',
        link: 'https://www.linkedin.com/in/th%E1%BB%8Bnh-nguy%E1%BB%85n-b6a5732ab?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        color: 'blue'
      },
      {
        icon: '📧',
        title: 'Email',
        description: 'Send me a message',
        value: 'nguyentuanthinh1211.fcj@gmail.com',
        link: 'mailto:nguyentuanthinh1211.fcj@gmail.com',
        color: 'green'
      },
      {
        icon: '📱',
        title: 'Phone',
        description: 'Call or text me',
        value: '+84 379498722',
        link: 'tel:+84379498722',
        color: 'purple'
      },
      {
        icon: '📘',
        title: 'Facebook',
        description: 'Connect on social media',
        value: 'Thinh Nguyen',
        link: 'https://www.facebook.com/thinh.nguyen.330496/',
        color: 'indigo'
      }
    ];

    const getColorClasses = (color) => {
      const colors = {
        blue: 'bg-blue-600/20 text-blue-300 border-blue-500/30 hover:bg-blue-600/30',
        green: 'bg-green-600/20 text-green-300 border-green-500/30 hover:bg-green-600/30',
        purple: 'bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30',
        indigo: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-600/30'
      };
      return colors[color] || colors.blue;
    };

    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="relative bg-slate-800/90 backdrop-blur-sm p-1 w-full max-w-4xl rounded-lg gradient-border animate-gradient-spin">
          <div className="relative w-full bg-slate-800 rounded-md p-8 overflow-hidden">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">Get In Touch</h1>
                <p className="text-xl text-blue-400 font-medium mb-2">Stay connected and keep inspiring together!</p>
                <p className="text-gray-300">
                  I'm always open to discussing new opportunities, collaborations, or just having a friendly chat about technology and development.
                </p>
              </div>

              {/* Contact Methods Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.link}
                    target={method.link.startsWith('http') ? '_blank' : '_self'}
                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : ''}
                    className={`block p-6 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg ${getColorClasses(method.color)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{method.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-1">{method.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{method.description}</p>
                        <p className="font-medium break-all">{method.value}</p>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                {/* Current Status */}
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    Current Status
                  </h2>
                  <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg p-4">
                    <p className="text-white">
                      <strong>Cloud Engineer Intern</strong> at Amazon Web Services Vietnam Ltd
                    </p>
                    <p className="text-gray-300 mt-1">
                      Part of the Amazon First Cloud Journey program, expanding my cloud computing expertise while continuing to develop my fullstack development skills.
                    </p>
                  </div>
                </div>

                {/* What I'm Looking For */}
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    What I'm Looking For
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-600/30 rounded-lg p-4">
                      <h3 className="text-white font-medium mb-2">🤝 Collaboration Opportunities</h3>
                      <p className="text-gray-400 text-sm">
                        Open source projects, hackathons, or team collaborations to learn and grow together.
                      </p>
                    </div>
                    <div className="bg-slate-600/30 rounded-lg p-4">
                      <h3 className="text-white font-medium mb-2">💼 Career Opportunities</h3>
                      <p className="text-gray-400 text-sm">
                        Internships, junior developer positions, or mentorship opportunities in fullstack development.
                      </p>
                    </div>
                    <div className="bg-slate-600/30 rounded-lg p-4">
                      <h3 className="text-white font-medium mb-2">📚 Learning & Mentorship</h3>
                      <p className="text-gray-400 text-sm">
                        Connecting with experienced developers for guidance and knowledge sharing.
                      </p>
                    </div>
                    <div className="bg-slate-600/30 rounded-lg p-4">
                      <h3 className="text-white font-medium mb-2">🌐 Networking</h3>
                      <p className="text-gray-400 text-sm">
                        Building meaningful connections within the tech community.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">⏰</span>
                    Response Time
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                      <div className="text-2xl mb-2">📧</div>
                      <h3 className="text-green-300 font-medium mb-1">Email</h3>
                      <p className="text-gray-400 text-sm">Within 24 hours</p>
                    </div>
                    <div className="text-center p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                      <div className="text-2xl mb-2">💼</div>
                      <h3 className="text-blue-300 font-medium mb-1">LinkedIn</h3>
                      <p className="text-gray-400 text-sm">Within 48 hours</p>
                    </div>
                    <div className="text-center p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                      <div className="text-2xl mb-2">📱</div>
                      <h3 className="text-purple-300 font-medium mb-1">Phone</h3>
                      <p className="text-gray-400 text-sm">Best for urgent matters</p>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-2">Let's Connect!</h2>
                  <p className="text-gray-300 mb-4">
                    Whether you have a project idea, want to collaborate, or just want to say hello, I'd love to hear from you.
                  </p>
                  <p className="text-blue-400 font-medium">
                    Stay connected and keep inspiring together! 🚀
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 gradient-glow animate-gradient-spin pointer-events-none"></div>
        </div>
      </div>
    );
  };
  
  export default Contact;