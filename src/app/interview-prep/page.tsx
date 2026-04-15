"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronUp, Lightbulb, BookOpen, CheckCircle } from "lucide-react";

type CaseType = "spouse" | "naturalization" | "asylum" | "employment";

interface MarriageQuestion {
  id: number;
  question: string;
  answer: string;
}

interface CivicsQuestion {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const marriageQuestions: MarriageQuestion[] = [
  {
    id: 1,
    question: "How did you meet your spouse?",
    answer:
      "Provide a detailed, consistent account of where you met, what you were both doing, who introduced you, and any memorable details. USCIS will ask your spouse the same question to verify consistency.",
  },
  {
    id: 2,
    question: "What was your first date?",
    answer:
      "Describe the date, location, what you did, what you wore, where you went for food, and how the date ended. Include specific details that demonstrate intimate knowledge of the experience.",
  },
  {
    id: 3,
    question: "Describe your wedding day.",
    answer:
      "Share details about the wedding ceremony, guest count, location, what you wore, who was in the wedding party, any memorable moments, and how you celebrated.",
  },
  {
    id: 4,
    question: "What are your spouse's daily habits?",
    answer:
      "Mention specific routines: when they wake up, what they eat for breakfast, hobbies, work schedule, favorite music or shows, exercise habits, sleeping patterns, and other daily behaviors.",
  },
  {
    id: 5,
    question: "How do you share household expenses and finances?",
    answer:
      "Explain joint accounts, who pays which bills, how rent/mortgage is split, budget discussions, major purchase decisions, and financial planning conversations. Show partnership and shared responsibility.",
  },
  {
    id: 6,
    question: "What are your spouse's siblings' and parents' names?",
    answer:
      "Know your spouse's immediate family members' full names, ages, occupations, locations, and basic background. This is basic knowledge you should have.",
  },
  {
    id: 7,
    question: "Where does your spouse work and what do they do?",
    answer:
      "Describe the employer, location, job title, responsibilities, work schedule, salary range, how long they've worked there, and career goals. Show genuine knowledge of their professional life.",
  },
  {
    id: 8,
    question: "What are your spouse's hobbies and interests?",
    answer:
      "List specific hobbies, sports, creative interests, books they like, movies, travel preferences, and how you spend leisure time together. Show intimate knowledge of their personality.",
  },
  {
    id: 9,
    question: "How do you communicate when apart?",
    answer:
      "Explain phone calls, text messages, social media, letters, or video calls. Give specific examples of how frequently you communicate and topics you discuss.",
  },
  {
    id: 10,
    question: "What is the condition of your spouse's health?",
    answer:
      "Know any allergies, medications, previous illnesses, medical conditions, and how they maintain their health. This shows you pay attention to their wellbeing.",
  },
  {
    id: 11,
    question: "How many times have you been married before?",
    answer:
      "Be honest and consistent about all previous marriages for both you and your spouse. Have divorce decrees or death certificates ready if applicable.",
  },
  {
    id: 12,
    question: "When did you decide to get married?",
    answer:
      "Describe the proposal or decision, who suggested it first, timeframe, and what influenced the decision. Be consistent with your spouse's account.",
  },
  {
    id: 13,
    question: "Do you have any children? If so, what are their names and ages?",
    answer:
      "Know all children from current and previous relationships, their full names, birthdates, and custody arrangements. Have birth certificates available.",
  },
  {
    id: 14,
    question: "What is your spouse's favorite food?",
    answer:
      "Know their dietary preferences, favorite restaurants, cuisines, specific dishes they love, and any food allergies or restrictions.",
  },
  {
    id: 15,
    question: "How long have you been together?",
    answer:
      "Know exact dates: when you met, started dating, got engaged, and married. Timeline consistency is crucial for USCIS evaluation of bona fide marriage.",
  },
];

const civicsQuestions: CivicsQuestion[] = [
  {
    id: 1,
    category: "Principles of American Democracy",
    question: "What is the supreme law of the land?",
    answer: "The Constitution",
  },
  {
    id: 2,
    category: "Principles of American Democracy",
    question: "What does the Constitution do?",
    answer:
      "It sets up the government, defines the government, and protects the basic rights of Americans",
  },
  {
    id: 3,
    category: "Principles of American Democracy",
    question: "The idea of self-government is in the first three words of the Constitution. What are these words?",
    answer: '"We the People"',
  },
  {
    id: 4,
    category: "Principles of American Democracy",
    question: "What is an amendment?",
    answer: "A change (to the Constitution), an addition (to the Constitution)",
  },
  {
    id: 5,
    category: "Principles of American Democracy",
    question: "What do we call the first ten amendments to the Constitution?",
    answer: "The Bill of Rights",
  },
  {
    id: 6,
    category: "Principles of American Democracy",
    question: "What is one right or freedom from the First Amendment?",
    answer:
      "Speech, Religion, Press, Assembly, or the right to petition the government",
  },
  {
    id: 7,
    category: "System of Government",
    question: "How many branches of government are there?",
    answer: "Three",
  },
  {
    id: 8,
    category: "System of Government",
    question: "What are the three branches of government?",
    answer: "Legislative, Executive, and Judicial",
  },
  {
    id: 9,
    category: "System of Government",
    question: "What makes up the Legislative Branch of government?",
    answer: "Congress, Senate, and House of Representatives",
  },
  {
    id: 10,
    category: "System of Government",
    question: "How many senators are there in Congress?",
    answer: "100 (2 from each state)",
  },
  {
    id: 11,
    category: "System of Government",
    question: "We elect a U.S. Senator for how many years?",
    answer: "6 years",
  },
  {
    id: 12,
    category: "System of Government",
    question: "How many U.S. Senators are there from your state?",
    answer: "2",
  },
  {
    id: 13,
    category: "System of Government",
    question: "Who is the President of the United States now?",
    answer: "Joe Biden (as of 2024)",
  },
  {
    id: 14,
    category: "Rights and Responsibilities",
    question: "What is one responsibility that is ONLY for United States citizens?",
    answer: "Serve on a jury, vote",
  },
  {
    id: 15,
    category: "Rights and Responsibilities",
    question: "What are two rights of everyone living in the United States?",
    answer: "Freedom of expression, freedom of speech, freedom of assembly, freedom to petition, freedom of religion, or the right to bear arms",
  },
  {
    id: 16,
    category: "Colonial Period and Independence",
    question: "What happened at the Constitutional Convention?",
    answer:
      "The Constitution was written, Delegates agreed to replace the Articles of Confederation with the Constitution",
  },
  {
    id: 17,
    category: "Colonial Period and Independence",
    question: "When was the Constitution written?",
    answer: "1787",
  },
  {
    id: 18,
    category: "Colonial Period and Independence",
    question: "What was one important thing that Benjamin Franklin did?",
    answer:
      "U.S. diplomat, oldest member of the Constitutional Convention, helped draft the Constitution, invented the lightning rod, founded a newspaper",
  },
  {
    id: 19,
    category: "American Government",
    question: "What is the executive branch of government?",
    answer: "The President, Cabinet, and departments under the President",
  },
  {
    id: 20,
    category: "American Government",
    question: "Who signs bills to become laws?",
    answer: "The President",
  },
];

const tips = [
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    title: "Be Consistent",
    description: "Your answers must match your spouse's. Discuss and align on details beforehand.",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    title: "Bring Original Documents",
    description: "Marriage certificate, photos together, joint lease/mortgage, bank statements, utility bills.",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    title: "Show Affection Naturally",
    description:
      "Smile when talking about your spouse. Show genuine emotion and comfort with each other during interview.",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    title: "Know Personal Details",
    description:
      "Memorize: birthdate, place of birth, parents' names, siblings' names, address, phone number, email.",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    title: "Practice with Your Spouse",
    description: "Do mock interviews together. One person asks questions while the other answers.",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    title: "Speak Clearly",
    description: "Don't rush your answers. Pause briefly to think. Use simple, direct language.",
  },
];

const EnglishTestTips = [
  "USCIS will evaluate your ability to read, write, and speak English during the interview",
  "Practice reading simple sentences about U.S. history and government",
  "Write basic sentences about your background and why you want citizenship",
  "Speak clearly and at a normal pace during the interview",
  "You don't need to be perfect - just able to communicate in basic English",
  "If English is difficult, practice with a tutor or language learning app",
];

export default function InterviewPrep() {
  const [selectedCase, setSelectedCase] = useState<CaseType | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [quizProgress, setQuizProgress] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const handleQuestionClick = (id: number) => {
    if (!answeredQuestions.has(id)) {
      const newAnswered = new Set(answeredQuestions);
      newAnswered.add(id);
      setAnsweredQuestions(newAnswered);
      setQuizProgress(newAnswered.size);
    }
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 rounded-full bg-blue-900/10 border border-blue-900/30 mb-4">
              <span className="text-blue-900 text-sm font-semibold">INTERVIEW PREPARATION</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Master Your Immigration Interview
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Prepare confidently with our comprehensive interview guides, practice questions, and expert tips.
            </p>
          </div>

          {/* Case Type Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              {
                type: "spouse" as CaseType,
                label: "Marriage Interview",
                desc: "Spouse/K-1 visa",
              },
              {
                type: "naturalization" as CaseType,
                label: "Naturalization",
                desc: "Civics + English test",
              },
              { type: "asylum" as CaseType, label: "Asylum", desc: "Credible fear" },
              {
                type: "employment" as CaseType,
                label: "Employment-Based",
                desc: "Work visa interview",
              },
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => {
                  setSelectedCase(selectedCase === option.type ? null : option.type);
                  setExpandedQuestion(null);
                  setQuizProgress(0);
                  setAnsweredQuestions(new Set());
                }}
                className={`p-4 rounded-lg border transition-all ${
                  selectedCase === option.type
                    ? "bg-blue-900/20 border-blue-900 shadow-lg shadow-blue-900/20"
                    : "bg-gray-50 border-gray-300 hover:border-blue-900/50 hover:bg-gray-100"
                }`}
              >
                <div className="font-semibold text-blue-900 mb-1">{option.label}</div>
                <div className="text-sm text-slate-600">{option.desc}</div>
              </button>
            ))}
          </div>

          {/* Content Sections */}
          {selectedCase === "spouse" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Questions List */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-50 border-gray-300">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-blue-900" />
                      Common Marriage Interview Questions
                    </h2>

                    <div className="space-y-3">
                      {marriageQuestions.map((q) => (
                        <div
                          key={q.id}
                          className="border border-gray-300 rounded-lg overflow-hidden bg-white"
                        >
                          <button
                            onClick={() => handleQuestionClick(q.id)}
                            className="w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <span className="text-blue-900 font-semibold min-w-6">{q.id}.</span>
                            <div className="flex-1">
                              <p className="text-slate-900 font-medium">{q.question}</p>
                            </div>
                            {expandedQuestion === q.id ? (
                              <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0 mt-1" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0 mt-1" />
                            )}
                          </button>

                          {expandedQuestion === q.id && (
                            <div className="px-4 pb-4 border-t border-gray-300 bg-gray-50">
                              <p className="text-slate-600 leading-relaxed">{q.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Practice Button */}
                <div className="mt-6">
                  <Link href="/chat?mode=interview-prep&type=spouse">
                    <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold">
                      Practice with AI Interview Coach
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Tips Panel */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-50 border-gray-300 sticky top-24">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-900" />
                      Interview Tips
                    </h3>

                    <div className="space-y-3">
                      {tips.map((tip, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="flex-shrink-0">{tip.icon}</div>
                          <div>
                            <p className="text-slate-900 font-medium text-sm">{tip.title}</p>
                            <p className="text-slate-600 text-xs mt-1">{tip.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                      <p className="text-blue-900 text-sm">
                        <strong>Pro Tip:</strong> USCIS will interview both spouses separately. Consistency is key to
                        proving a bona fide marriage.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {selectedCase === "naturalization" && (
            <div>
              <Card className="bg-gray-50 border-gray-300 mb-6">
                <div className="p-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-blue-900" />
                      USCIS Civics Test
                    </h2>
                    <p className="text-slate-600">
                      Learn 100 civics questions required for the N-400 naturalization interview. You'll be asked up to 10 questions, and must answer at least 6 correctly to pass.
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-600">Questions Reviewed</span>
                      <span className="text-blue-900 font-semibold">
                        {quizProgress}/20
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-900 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(quizProgress / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[
                      { name: "Principles of American Democracy", count: 6 },
                      { name: "System of Government", count: 7 },
                      { name: "Rights and Responsibilities", count: 4 },
                      { name: "Colonial Period and Independence", count: 3 },
                    ].map((cat) => (
                      <div key={cat.name} className="p-3 bg-white rounded-lg border border-gray-300">
                        <p className="text-slate-900 font-medium text-sm">{cat.name}</p>
                        <p className="text-slate-600 text-xs mt-1">{cat.count} questions</p>
                      </div>
                    ))}
                  </div>

                  {/* Questions */}
                  <div className="space-y-3 mb-8">
                    {civicsQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="border border-gray-300 rounded-lg overflow-hidden bg-white"
                      >
                        <button
                          onClick={() => handleQuestionClick(q.id)}
                          className="w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <span className="text-blue-900 font-semibold min-w-6">{q.id}.</span>
                          <div className="flex-1">
                            <p className="text-slate-900 font-medium text-sm">{q.question}</p>
                            <p className="text-xs text-slate-500 mt-1">{q.category}</p>
                          </div>
                          {expandedQuestion === q.id ? (
                            <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0 mt-1" />
                          )}
                        </button>

                        {expandedQuestion === q.id && (
                          <div className="px-4 pb-4 border-t border-gray-300 bg-gray-50">
                            <p className="text-slate-600 font-medium text-sm">Answer: {q.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* English Test Tips */}
                  <div className="bg-blue-900/10 border border-blue-900/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">English Test Requirements</h3>
                    <ul className="space-y-2">
                      {EnglishTestTips.map((tip, idx) => (
                        <li key={idx} className="flex gap-2 text-slate-600 text-sm">
                          <span className="text-blue-900 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* CTA */}
              <Link href="/chat?mode=interview-prep&type=naturalization">
                <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold text-lg">
                  Start AI Practice Session
                </Button>
              </Link>
            </div>
          )}

          {selectedCase === "asylum" && (
            <Card className="bg-gray-50 border-gray-300">
              <div className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-blue-900 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-900 mb-2">Asylum Interview Preparation</h3>
                <p className="text-slate-600 mb-6">
                  Comprehensive guide for credible fear screening and asylum interviews coming soon.
                </p>
                <Link href="/chat?mode=interview-prep&type=asylum">
                  <Button className="bg-blue-900 hover:bg-blue-800 text-white">
                    Chat with Advisor
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {selectedCase === "employment" && (
            <Card className="bg-gray-50 border-gray-300">
              <div className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-blue-900 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-900 mb-2">Employment-Based Interview Prep</h3>
                <p className="text-slate-600 mb-6">
                  Guide for H-1B, L-1, EB visa interviews coming soon. Get real-time help from our AI advisor.
                </p>
                <Link href="/chat?mode=interview-prep&type=employment">
                  <Button className="bg-blue-900 hover:bg-blue-800 text-white">
                    Chat with Advisor
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {!selectedCase && (
            <Card className="bg-gray-50 border-gray-300">
              <div className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-blue-900 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-900 mb-2">Select Your Interview Type</h3>
                <p className="text-slate-600">
                  Choose above to get started with interview preparation materials, practice questions, and AI coaching.
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
