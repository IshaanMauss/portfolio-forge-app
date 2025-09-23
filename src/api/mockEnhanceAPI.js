// This FAKE "mock" function simulates calling different AI endpoints
// for your friend to implement later.
export async function getEnhancedDescription(type, input) {
  console.log(`%cCalling Mock AI for type: "${type}"`, 'color: #64ffda;');
  console.log('%cInput:', 'color: #8892b0;', input);

  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay

  let response;
  switch (type) {
    case 'bio':
      response = { enhancedText: `An AI-enhanced bio based on these interests: ${input.interests}. I am a passionate and driven student with a strong foundation in software development and a keen interest in leveraging technology to solve real-world problems.` };
      break;
    case 'project':
      response = { enhancedText: `A professionally enhanced description for '${input.title}'. This project showcases skills in ${input.keywords} and demonstrates a strong ability to deliver high-quality web solutions.` };
      break;
    case 'skills': // This now correctly handles both Hard and Soft skills
      const hardSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Firebase', 'HTML5', 'CSS3', 'Java', 'Next.js', 'SQL', 'MongoDB', 'GraphQL', 'TypeScript', 'Jest', 'MERN Stack'];
      const softSkills = ['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Adaptability', 'Creativity', 'Work Ethic', 'Time Management'];
      const allSkills = [...hardSkills, ...softSkills];
      response = { suggestions: allSkills.filter(s => s.toLowerCase().startsWith(input.partial.toLowerCase())) };
      break;
    case 'interests':
      const allInterests = ['Web Development', 'Artificial Intelligence', 'Machine Learning', 'Open Source Contribution', 'Mobile App Development', 'UI/UX Design', 'Game Development', 'Cloud Computing', 'Cybersecurity'];
      response = { suggestions: allInterests.filter(i => i.toLowerCase().includes(input.partial.toLowerCase())) };
      break;
    case 'theme':
        if (input.mood?.toLowerCase().includes('funny')) {
            response = { suggestedTheme: { backgroundColor: '#FFF8E7', textColor: '#5D4037', accentColor: '#FF6F61' } };
        } else if (input.mood?.toLowerCase().includes('dark')) {
            response = { suggestedTheme: { backgroundColor: '#121212', textColor: '#EAEAEA', accentColor: '#BB86FC' } };
        } else {
            response = { suggestedTheme: { backgroundColor: '#1D2D44', textColor: '#F0EBD8', accentColor: '#F7C873' } };
        }
        break;
    default:
      response = { error: 'Invalid AI request type' };
  }
  
  console.log('%cMock AI Response:', 'color: #64ffda;', response);
  return response;
}