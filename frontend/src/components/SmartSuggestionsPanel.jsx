import React, { useState } from 'react';
import { teamMembers, projectPlan, activityFeed } from '../mockData/comprehensiveMockData';

/**
 * SmartSuggestionsPanel Component
 * Displays AI-powered smart suggestions for various team tasks
 */
const SmartSuggestionsPanel = () => {
  const [activeOutput, setActiveOutput] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock function generators
  const generateWeeklySchedule = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const schedule = `📅 WEEKLY SCHEDULE - Week of ${new Date().toLocaleDateString()}

🔹 MONDAY
• 9:00 AM - Sprint Planning (Sarah Chen, Mike Rodriguez, Emily Zhang)
• 11:00 AM - Design Review Session (Emily Zhang, Alex Kumar)
• 2:00 PM - Backend Sync (Mike Rodriguez, James Park)

🔹 TUESDAY
• 10:00 AM - Code Review Block (All Developers)
• 1:00 PM - QA Standup (Lisa Williams, Team)
• 3:30 PM - Security Discussion (Lisa Williams, Mike Rodriguez)

🔹 WEDNESDAY
• 9:30 AM - Client Demo Prep (Sarah Chen, Emily Zhang)
• 12:00 PM - Team Lunch & Learn
• 2:00 PM - Infrastructure Review (James Park, Mike Rodriguez)

🔹 THURSDAY
• 10:00 AM - User Testing Session (Emily Zhang, Lisa Williams)
• 1:00 PM - Performance Optimization Workshop (Mike Rodriguez, Alex Kumar)
• 4:00 PM - Weekly Metrics Review (Maria Garcia, Sarah Chen)

🔹 FRIDAY
• 9:00 AM - Sprint Retrospective (Entire Team)
• 11:00 AM - Documentation Time (All)
• 2:00 PM - Focus Time / No Meetings

⚠️ IMPORTANT NOTES:
• James Park on leave until Nov 20 - Alex Kumar covering DevOps
• Mobile app beta testing feedback due by Friday
• Security audit follow-up scheduled for next Monday`;

      setActiveOutput({ type: 'schedule', content: schedule });
      setIsGenerating(false);
    }, 1500);
  };

  const summarizeProgress = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const summary = `📊 PROGRESS SUMMARY - ${new Date().toLocaleDateString()}

✅ COMPLETED THIS WEEK:
• Sprint 4 Backend Implementation submitted (Mike Rodriguez)
• Security Penetration Test completed with 0 critical issues (Lisa Williams)
• User Documentation Portal approved and deployed (Sarah Chen)
• Mobile App Prototype (Android) ready for beta testing (Emily Zhang)

🔄 IN PROGRESS:
• Backend API Phase 2 - 85% complete (on track for Nov 5 deadline)
• Mobile App Development - 60% complete (iOS version pending)
• Documentation & Training - 70% complete
• CI/CD Pipeline Setup - 45% complete (at risk due to James Park leave)

⚠️ BLOCKERS & RISKS:
• Database migration scripts need revision (missing rollback procedures)
• CI/CD pipeline delayed - James on leave, Alex covering
• iOS app development timeline needs clarification

📈 KEY METRICS:
• Overall Project Progress: 62%
• Milestones Completed: 4 of 10
• On-Time Delivery Rate: 87%
• Team Velocity: Stable

🎯 NEXT WEEK PRIORITIES:
1. Complete Backend API Phase 2 optimization
2. Finalize iOS mobile app prototype
3. Address database migration feedback
4. Deploy CI/CD pipeline to staging

👏 TEAM HIGHLIGHTS:
• Mike's API optimization achieved 65% performance improvement!
• Security audit passed with flying colors - kudos to Lisa!
• Emily's mobile app beta getting excellent early feedback`;

      setActiveOutput({ type: 'progress', content: summary });
      setIsGenerating(false);
    }, 1800);
  };

  const draftAnnouncement = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const announcement = `📢 TEAM ANNOUNCEMENT

Subject: Sprint 4 Completion & Sprint 5 Kickoff

Hi Team,

Great work wrapping up Sprint 4! We've made significant progress across multiple fronts and I wanted to share some highlights and upcoming priorities.

🎉 SPRINT 4 ACHIEVEMENTS:
• Backend performance optimization delivered 65% faster API responses
• Security audit completed with zero critical vulnerabilities
• Mobile app beta (Android) is now available for team testing
• User documentation portal successfully launched

👏 SPECIAL RECOGNITION:
• Mike Rodriguez - Outstanding work on the API optimization
• Lisa Williams - Excellent coordination on security compliance
• Emily Zhang - Mobile app prototype exceeded expectations

📋 SPRINT 5 FOCUS AREAS:
Starting this week, our priorities shift to:
1. iOS mobile app development (Emily & team)
2. Database migration refinements (James/Alex)
3. CI/CD pipeline completion (Alex covering for James)
4. Final QA preparations (Lisa & team)

⚠️ TEAM UPDATES:
• James Park is on leave until Nov 20. Alex Kumar will cover urgent DevOps needs.
• Sprint Review scheduled for Friday at 2 PM - please prepare your demos
• Client presentation is scheduled for Nov 18 - more details to follow

🎯 REMINDERS:
• Mobile app beta testing feedback due by Friday EOD
• Update your time logs by end of week
• Sprint Planning for Sprint 6 is Monday, 9 AM

Keep up the excellent work! We're 62% through the project and staying on track for our December launch.

Questions? Reach out anytime.

Best regards,
Sarah Chen
Project Manager`;

      setActiveOutput({ type: 'announcement', content: announcement });
      setIsGenerating(false);
    }, 2000);
  };

  const createAvailabilityReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const report = `👥 TEAM AVAILABILITY REPORT - ${new Date().toLocaleDateString()}

📊 CURRENT AVAILABILITY STATUS:

✅ AVAILABLE (4 members)
• Sarah Chen - Project Manager
  └ Timezone: PST (UTC-8) | 9:00 AM - 5:00 PM
  └ Currently: Available for meetings

• Emily Zhang - UI/UX Designer
  └ Timezone: CST (UTC-6) | 10:00 AM - 6:00 PM
  └ Currently: Available for collaboration

• Lisa Williams - QA Lead
  └ Timezone: EST (UTC-5) | 9:00 AM - 5:00 PM
  └ Currently: Available for testing reviews

• Alex Kumar - Frontend Developer
  └ Timezone: IST (UTC+5:30) | 9:30 AM - 6:30 PM
  └ Currently: Available (covering DevOps for James)

⏰ BUSY - LIMITED AVAILABILITY (2 members)
• Mike Rodriguez - Backend Developer
  └ Timezone: EST (UTC-5) | 8:00 AM - 4:00 PM
  └ Currently: In Meeting (available after 3 PM)

• Maria Garcia - Data Analyst
  └ Timezone: CET (UTC+1) | 8:00 AM - 4:00 PM
  └ Currently: Focus Time (available after 2 PM)

🏖️ OUT OF OFFICE (1 member)
• James Park - DevOps Engineer
  └ On Leave - Returns Nov 20
  └ Coverage: Alex Kumar handling urgent DevOps issues

📅 OPTIMAL MEETING TIMES (All Zones):
• Best overlap window: 1:00 PM - 3:00 PM EST
• Maximum availability: Tuesday & Thursday afternoons
• Avoid scheduling: Before 9 AM EST, after 4 PM PST

⚡ CAPACITY NOTES:
• Alex Kumar at 120% capacity (covering for James)
• Frontend team has bandwidth for urgent requests
• QA team available for ad-hoc testing sessions
• Design reviews best scheduled Wed-Thu

🔔 UPCOMING ABSENCES:
• None scheduled for next 2 weeks (after James returns)`;

      setActiveOutput({ type: 'availability', content: report });
      setIsGenerating(false);
    }, 1600);
  };

  const generateEscalationNote = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const note = `🚨 ESCALATION NOTE

Date: ${new Date().toLocaleDateString()}
Project: AI Red Team Platform
Escalated By: Sarah Chen (Project Manager)
Escalated To: Executive Stakeholders

ISSUE SUMMARY:
Critical resource constraint impacting Milestone M8 (CI/CD & Infrastructure Setup) delivery timeline.

📋 SITUATION:
James Park (DevOps Engineer) is on approved leave until November 20, 2025. During his absence, the CI/CD Pipeline Configuration deliverable was submitted but requires significant revisions before approval.

Current Status of M8:
• Target Date: November 25, 2025
• Current Progress: 45%
• Status: AT RISK ⚠️

🔍 IMPACT ANALYSIS:
1. TIMELINE RISK: High probability of 1-2 week delay for Milestone M8
2. DOWNSTREAM EFFECTS: May impact start of M9 (Beta Testing & QA)
3. RESOURCE PRESSURE: Alex Kumar covering both Frontend and DevOps at 120% capacity
4. QUALITY CONCERN: Rushed pipeline implementation increases deployment risk

💡 PROPOSED SOLUTIONS:
Option 1 (RECOMMENDED): Engage temporary DevOps contractor
• Pros: Specialized expertise, no delay to M8, relieves Alex's workload
• Cons: Additional cost (~$8,000 for 2 weeks)
• Timeline: Can onboard within 3-5 business days

Option 2: Extend M8 deadline to December 5
• Pros: No additional cost, realistic timeline
• Cons: Compresses M9 timeline, risks overall project delivery

Option 3: Descope non-critical pipeline features
• Pros: Keeps M8 on schedule, no additional cost
• Cons: Manual deployment steps required, technical debt

📊 RECOMMENDATION:
Approve Option 1 (temporary contractor) to maintain project timeline and quality standards. The $8,000 investment is well within our contingency budget and prevents downstream delays that could cost significantly more.

🎯 REQUESTED DECISION:
• Approval to engage DevOps contractor for 2-week engagement
• Budget allocation from contingency fund
• Fast-track procurement process

⏰ URGENCY:
Decision needed by November 15 to prevent further delays.

PREPARED BY:
Sarah Chen, Project Manager
sarah.chen@company.com`;

      setActiveOutput({ type: 'escalation', content: note });
      setIsGenerating(false);
    }, 1700);
  };

  const suggestions = [
    {
      id: 'schedule',
      icon: '📅',
      title: 'Generate Weekly Schedule',
      description: 'Create team schedule based on availability and upcoming tasks',
      action: generateWeeklySchedule,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'progress',
      icon: '📊',
      title: 'Summarize Progress Updates',
      description: 'Compile team progress, blockers, and key metrics',
      action: summarizeProgress,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'announcement',
      icon: '📢',
      title: 'Draft Team Announcement',
      description: 'Generate professional team communication',
      action: draftAnnouncement,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'availability',
      icon: '👥',
      title: 'Create Availability Report',
      description: 'Show current team availability and optimal meeting times',
      action: createAvailabilityReport,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'escalation',
      icon: '🚨',
      title: 'Escalation Note Generator',
      description: 'Draft formal escalation note for stakeholders',
      action: generateEscalationNote,
      color: 'from-red-500 to-rose-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Suggestions</h1>
        <p className="text-gray-600">AI-powered tools to streamline your workflow</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={suggestion.action}
            disabled={isGenerating}
            className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-gray-200 ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
            style={{
              background: `linear-gradient(135deg, ${suggestion.color.split(' ')[0].replace('from-', '')} 0%, ${suggestion.color.split(' ')[1].replace('to-', '')} 100%)`
            }}
          >
            <div className="text-5xl mb-3">{suggestion.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{suggestion.title}</h3>
            <p className="text-white text-opacity-90">{suggestion.description}</p>
          </button>
        ))}
      </div>

      {/* Output Display */}
      {isGenerating && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-lg text-gray-600">Generating...</span>
          </div>
        </div>
      )}

      {activeOutput && !isGenerating && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4">
            <h2 className="text-xl font-bold">Generated Output</h2>
          </div>
          <div className="p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-6 rounded-lg border border-gray-200 leading-relaxed">
              {activeOutput.content}
            </pre>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(activeOutput.content)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                📋 Copy to Clipboard
              </button>
              <button
                onClick={() => setActiveOutput(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestionsPanel;
