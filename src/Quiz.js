import React, { useState, useEffect, useCallback } from 'react';
import './style.css';

const questions = [
  {
    question: "가장 좋아하는 데이트 장소는?",
    choices: ["영화관", "카페", "공원"],
    correctAnswer: "공원"
  },
  {
    question: "가장 좋아하는 음식은?",
    choices: ["피자", "초밥", "파스타"],
    correctAnswer: "초밥"
  },
  {
    question: "가장 좋아하는 계절은?",
    choices: ["봄", "여름", "가을", "겨울"],
    correctAnswer: "가을"
  },
  {
    question: "가장 좋아하는 색깔은?",
    choices: ["빨강", "파랑", "초록", "노랑"],
    correctAnswer: "파랑"
  },
  {
    question: "가장 좋아하는 취미는?",
    choices: ["독서", "영화 감상", "운동", "여행"],
    correctAnswer: "여행"
  },
  {
    question: "가장 좋아하는 동물은?",
    choices: ["강아지", "고양이", "토끼", "새"],
    correctAnswer: "강아지"
  },
  {
    question: "가장 가고 싶은 여행지는?",
    choices: ["파리", "도쿄", "뉴욕", "로마"],
    correctAnswer: "파리"
  },
  {
    question: "가장 좋아하는 음악 장르는?",
    choices: ["팝", "록", "클래식", "재즈"],
    correctAnswer: "클래식"
  }
];

function Quiz() {
  const [page, setPage] = useState('intro');
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 타이머 설정

  const handleSubmit = useCallback(() => {
    let newScore = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  }, [answers]);

  useEffect(() => {
    if (page === 'quiz' && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [page, submitted, handleSubmit]);

  const handleAnswer = (questionIndex, choice) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = choice;
    setAnswers(newAnswers);
  };

  const getProgress = () => {
    const answeredCount = answers.filter(answer => answer !== null).length;
    return (answeredCount / questions.length) * 100;
  };

  const getResultMessage = () => {
    if (score >= 5) {
      return "저를 잘 아시는군요!";
    } else if (score >= 3) {
      return "저에 대해서 공부해주세요.";
    } else {
      return "좀 더 알아가야겠어요.";
    }
  };

  if (page === 'intro') {
    return (
      <div className="quiz-container">
        <h1>시작하기</h1>
        <button onClick={() => setPage('quiz')}>시작</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1>모의고사</h1>
      <div className="progress-bar" style={{ width: `${getProgress()}%` }}></div>
      <div className="timer">남은 시간: {timeLeft}초</div>
      {!submitted ? (
        <>
          {questions.map((q, index) => (
            <div key={index} className="question-block">
              <div className="question">{q.question}</div>
              <ul className="choices">
                {q.choices.map((choice, choiceIndex) => (
                  <li
                    key={choiceIndex}
                    className={answers[index] === choice ? 'selected' : ''}
                    onClick={() => handleAnswer(index, choice)}
                  >
                    {choice}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={handleSubmit}>제출</button>
        </>
      ) : (
        <div className="result">
          <h2>결과</h2>
          {answers.map((answer, index) => (
            <div key={index}>
              Q{index + 1}: {answer} {answer === questions[index].correctAnswer ? '✓' : '✗'}
            </div>
          ))}
          <div className="summary">
            <p>총 점수: {score} / {questions.length}</p>
            <p>{getResultMessage()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
