"use client";

import { useState, useEffect, useMemo } from "react";
import { X, CheckCircle, XCircle } from "lucide-react";
import type { QuizQuestion } from "@/types/museum";

interface QuizModalProps {
  isOpen: boolean;
  roomNumber: number;
  questions: QuizQuestion[];
  onPass: () => void;
  onClose: () => void;
}

interface ShuffledQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  originalIndex: number;
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function QuizModal({
  isOpen,
  roomNumber,
  questions,
  onPass,
  onClose,
}: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState<number[]>([]);

  // Shuffle questions and answers when modal opens
  const shuffledQuestions = useMemo(() => {
    if (!isOpen) return [];
    
    // First, shuffle the order of questions
    const shuffledQs = shuffleArray(questions);
    
    // Then, shuffle the answer options for each question
    return shuffledQs.map((q) => {
      const indexedOptions = q.options.map((opt, idx) => ({ opt, idx }));
      const shuffledOptions = shuffleArray(indexedOptions);
      
      // Find the new position of the correct answer
      const newCorrectAnswer = shuffledOptions.findIndex(
        (item) => item.idx === q.correctAnswer
      );
      
      return {
        question: q.question,
        options: shuffledOptions.map((item) => item.opt),
        correctAnswer: newCorrectAnswer,
        originalIndex: questions.indexOf(q),
      };
    });
  }, [isOpen, questions]);

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setCorrectCount(0);
      setScore([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || shuffledQuestions.length === 0) return null;

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === shuffledQuestions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setCorrectCount((prev) => prev + 1);
      setScore((prev) => [...prev, 1]);
    } else {
      setScore((prev) => [...prev, 0]);
    }
  };

  const handleNext = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      if (correctCount === shuffledQuestions.length) {
        onPass();
      } else {
        // Show retry message or close
        alert(`Bạn đã trả lời đúng ${correctCount}/${shuffledQuestions.length} câu. Vui lòng thử lại!`);
        onClose();
      }
    }
  };

  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;
  const correctAnswerText = shuffledQuestions[currentQuestion].options[shuffledQuestions[currentQuestion].correctAnswer];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#16213e] border-2 border-[#0f3460] rounded-lg max-w-2xl w-full max-h-[95vh] overflow-y-auto no-scrollbar">
        <div className="sticky top-0 bg-[#16213e] border-b border-[#0f3460] p-6 flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#e8e8e8]">
              Câu hỏi Phòng {roomNumber}
            </h2>
            <p className="text-sm text-[#94a3b8] mt-1">
              Trả lời đúng tất cả câu hỏi để mở khóa phòng tiếp theo
            </p>
            <div className="mt-3 bg-[#1a1a2e] rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#4ade80] to-[#22c55e] h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Score Display */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: shuffledQuestions.length }).map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    index < score.length
                      ? score[index] === 1
                        ? "bg-green-500/20 border-green-500 text-green-400"
                        : "bg-red-500/20 border-red-500 text-red-400"
                      : index === currentQuestion
                      ? "bg-[#4ade80]/20 border-[#4ade80] text-[#4ade80] animate-pulse"
                      : "bg-[#1a1a2e] border-[#0f3460] text-[#94a3b8]"
                  }`}
                >
                  {index < score.length ? (
                    score[index] === 1 ? (
                      "✓"
                    ) : (
                      "✗"
                    )
                  ) : (
                    index + 1
                  )}
                </div>
              ))}
            </div>
            <span className="text-sm font-semibold text-[#4ade80] ml-2">
              {correctCount}/{shuffledQuestions.length} đúng
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Question */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#4ade80]/20 text-[#4ade80] font-bold text-sm flex-shrink-0">
                {currentQuestion + 1}
              </span>
              <h3 className="text-lg font-semibold text-[#e8e8e8] leading-relaxed">
                {shuffledQuestions[currentQuestion].question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 ml-11">
              {shuffledQuestions[currentQuestion].options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === shuffledQuestions[currentQuestion].correctAnswer;
                const showAsCorrect = showResult && isCorrectAnswer;
                const showAsWrong = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      showAsCorrect
                        ? "border-green-500 bg-green-500/10 text-green-400 shadow-lg shadow-green-500/20"
                        : showAsWrong
                        ? "border-red-500 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/20"
                        : isSelected
                        ? "border-[#4ade80] bg-[#4ade80]/10 text-[#e8e8e8] shadow-lg shadow-[#4ade80]/20"
                        : "border-[#0f3460] bg-[#1a1a2e] text-[#cbd5e1] hover:border-[#4ade80]/50 hover:bg-[#0f3460]/50"
                    } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold flex-shrink-0 ${
                        showAsCorrect
                          ? "bg-green-500 text-white"
                          : showAsWrong
                          ? "bg-red-500 text-white"
                          : isSelected
                          ? "bg-[#4ade80] text-[#1a1a2e]"
                          : "bg-[#0f3460] text-[#94a3b8]"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showAsCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      )}
                      {showAsWrong && (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Message */}
          {showResult && (
            <div
              className={`p-5 rounded-lg mb-4 border-2 ${
                isCorrect
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-bold text-lg mb-2 ${
                    isCorrect ? "text-green-400" : "text-red-400"
                  }`}>
                    {isCorrect ? "🎉 Chính xác!" : "❌ Chưa đúng"}
                  </p>
                  <p className="text-sm text-[#cbd5e1] leading-relaxed">
                    {isCorrect
                      ? "Xuất sắc! Bạn đã trả lời đúng câu hỏi này."
                      : (
                        <>
                          <span className="font-semibold text-[#e8e8e8]">Đáp án đúng là:</span>
                          <span className="block mt-2 p-3 bg-[#0f3460]/50 rounded border border-green-500/30 text-green-400">
                            <span className="font-bold">{String.fromCharCode(65 + shuffledQuestions[currentQuestion].correctAnswer)}.</span> {correctAnswerText}
                          </span>
                        </>
                      )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-[#0f3460] to-[#16213e] border-t-2 border-[#1a1a2e] p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <p className="text-[#94a3b8]">
                Điểm số hiện tại
              </p>
              <p className="text-[#4ade80] font-bold text-lg">
                {correctCount}/{shuffledQuestions.length}
              </p>
            </div>
            
            {!showResult ? (
              <button
                onClick={handleAnswer}
                disabled={selectedAnswer === null}
                className="px-8 py-3 bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-[#1a1a2e] font-bold rounded-lg hover:from-[#22c55e] hover:to-[#16a34a] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Xác nhận đáp án
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-[#1a1a2e] font-bold rounded-lg hover:from-[#22c55e] hover:to-[#16a34a] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                {currentQuestion < shuffledQuestions.length - 1
                  ? "Câu tiếp theo →"
                  : correctCount === shuffledQuestions.length
                  ? "🎉 Hoàn thành Quiz"
                  : "🔄 Đóng"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}