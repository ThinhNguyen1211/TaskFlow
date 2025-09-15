const About = () => {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="relative bg-slate-800/90 backdrop-blur-sm p-1 w-full max-w-4xl rounded-lg gradient-border animate-gradient-spin">
          <div className="relative w-full bg-slate-800 rounded-md p-8 overflow-hidden">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">About Me</h1>
                <p className="text-xl text-blue-400 font-medium">Stay connected and keep inspiring together!</p>
              </div>

              {/* Main Content */}
              <div className="space-y-8">
                {/* Introduction */}
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">👋</span>
                    Hello, I'm Thinh!
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    I'm a driven IT student passionate about becoming a fullstack developer, with a strong focus on frontend development. 
                    I craft clean, user-friendly interfaces using modern technologies and have a keen eye for UI/UX design.
                  </p>
                </div>

                {/* Current Role */}
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">☁️</span>
                    Current Role
                  </h2>
                  <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-orange-300 mb-2">Cloud Engineer Intern</h3>
                    <p className="text-white font-medium">Amazon Web Services Vietnam Ltd</p>
                    <p className="text-gray-300 mt-2">Amazon First Cloud Journey Program</p>
                  </div>
                </div>

                {/* Technical Skills */}
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">💻</span>
                    Technical Skills
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Frontend */}
                    <div>
                      <h3 className="text-lg font-medium text-blue-400 mb-3">Frontend Development</h3>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {['HTML', 'CSS', 'JavaScript', 'React', 'Vite', 'TailwindCSS'].map(skill => (
                            <span key={skill} className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                          Self-taught with a strong focus on creating clean, user-friendly interfaces and UI/UX design.
                        </p>
                      </div>
                    </div>

                    {/* Backend */}
                    <div>
                      <h3 className="text-lg font-medium text-green-400 mb-3">Backend & Cloud</h3>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {['DynamoDB', 'MongoDB', 'SQL Server', 'AWS S3', 'AWS SES', 'C++', 'C#', 'Java', 'OOP', 'APIs'].map(skill => (
                            <span key={skill} className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                          Continuously developing these skills with hands-on experience in cloud technologies and backend development.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Qualities */}
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🌟</span>
                    Personal Qualities
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-slate-600/30 rounded-lg">
                      <div className="text-2xl mb-2">🎯</div>
                      <h3 className="text-white font-medium mb-1">Driven</h3>
                      <p className="text-gray-400 text-sm">Always eager to grow and tackle new challenges</p>
                    </div>
                    <div className="text-center p-4 bg-slate-600/30 rounded-lg">
                      <div className="text-2xl mb-2">💪</div>
                      <h3 className="text-white font-medium mb-1">Resilient</h3>
                      <p className="text-gray-400 text-sm">Persistent in overcoming obstacles and learning</p>
                    </div>
                    <div className="text-center p-4 bg-slate-600/30 rounded-lg">
                      <div className="text-2xl mb-2">🗣️</div>
                      <h3 className="text-white font-medium mb-1">Communicative</h3>
                      <p className="text-gray-400 text-sm">Proficient in English for reading and conversation</p>
                    </div>
                  </div>
                </div>

                {/* Learning Journey */}
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    Learning Journey
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    As a self-taught frontend developer, I'm fueled by a love for learning and continuous improvement. 
                    My journey in technology is driven by curiosity and the desire to create meaningful digital experiences. 
                    I believe in the power of clean code, thoughtful design, and the importance of staying connected with the developer community.
                  </p>
                </div>

                {/* Project Showcase */}
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    This Project
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    This Student Time Management System showcases my frontend development skills and passion for creating 
                    user-friendly applications. Built with React, Vite, and TailwindCSS, it demonstrates my ability to 
                    create responsive, interactive, and visually appealing web applications.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Vite', 'TailwindCSS', 'Local Storage', 'Responsive Design', 'Modern UI/UX'].map(tech => (
                      <span key={tech} className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 gradient-glow animate-gradient-spin pointer-events-none"></div>
        </div>
      </div>
    );
  };
  
  export default About;