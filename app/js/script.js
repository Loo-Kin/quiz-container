let QuizIntro = {
    methods: {
        beginQuiz: function() {
            this.$emit("quiz-begun");
        }
    },
    template: '#quiz-intro-template'
}

let QuizQuestion = {
    props: {
        question: {
            type: Object
        }
    },
    data: function() {
        return {
            selectedAnswer: null,
            isFeedbackMode: false
        };
    },
    methods: {
        selectAnswer: function(answerNum) {
            this.selectedAnswer = answerNum;
        },
        applyQuestion: function() {
            this.isFeedbackMode = true;
            if(this.question.answers[this.selectedAnswer].isCorrect) {
                this.$emit('answered-correct')
            } else {
                this.$emit('answered-incorrect')
            }
        },
        goToNextQuestion: function() {
            this.isFeedbackMode = false;
            this.selectedAnswer = null;
            this.$emit('go-to-next-question');
        }
    },
    template: '#quiz-question-template'
};

let QuizProgress = {
    props: {
        questions: {
            type: Array
        },
        progressData: {
            type: Array
        }
    },
    template: '#quiz-progress-template'
};

let QuizFeedback = {
    props: {
        questions: {
            type: Array
        },
        attempt: {
            type: Number
        },
        score: {
            type: Number
        },
        maxScore: {
            type: Number
        }
    },
    data: function() {
        return {
            quizSuccess = (this.score / this.maxScore) >= 0.8
        }
    },
    template: '#quiz-feedback-template'
};

Vue.component('quiz-container', {
    props: {
        questions: {
            type: Array
        },
        closeTestCallback: {
            type: Function,
            default: function () { }
        }
    },
    methods: {
        initQuiz: function() {
            this.isQuizBegun = true;
            this.attempts++;
            this.currentAnswers = [];
            this.currentQuestion = 0;
            this.currentScore = 0;

            shuffle(this.questions);
            this.questions.forEach(question => {
                shuffle(question.answers);
            });
        },
        restartQuiz: function() {
            this.initQuiz();
        },
        closeQuiz: function() {
            this.closeTestCallback();
        },
        addScore: function() {
            this.currentScore++;
            if(this.currentScore > this.maxScore) {
                this.maxScore = this.currentScore;
            }
        },
        updateProgress: function(answer) {
            this.currentAnswers.push(answer);
        }
    },
    data: function () {
        return {
            questionsData: this.questions,
            currentQuestion: 0,
            isQuizBegun: false,
            attempts: 0,
            currentScore: 0,
            currentAnswers: [],
            maxScore: 0
        }
    },
    components: {
        'quiz-intro': QuizIntro,
        'quiz-question': QuizQuestion,
        'quiz-progress': QuizProgress,
        'quiz-feedback': QuizFeedback
    },
    template: '#quiz-container-template'
});

new Vue({ 
    el: '#app',
    methods: {
        closeTestCallback: function() {
            window.close();
        }
    },
    data: {
        questions=[
            {
                questionText: 'Какой ресурс комплекта чернил у четырехцветных Epson L3100/3151/3156?',
                answers: [
                    {
                        answerText: '7 500 цветных и 4 500 ч/б отпечатков.',
                        isCorrect: true
                    }, {
                        answerText: '4 500 цветных и 7 500 ч/б отпечатков.',
                        isCorrect: false
                    }, {
                        answerText: '6 000 цветных и 7 500 ч/б отпечатков.',
                        isCorrect: false
                    }, {
                        answerText: '3 500 цветных и 2 000 ч/б отпечатков.',
                        isCorrect: false
                    }, 
                ]
            }, {
                questionText: 'Какие контейнеры с чернилами подходят для Epson L805?',
                answers: [
                    {
                        answerText: 'Контейнеры T664 серии.',
                        isCorrect: false
                    }, {
                        answerText: 'Контейнеры T673 серии.',
                        isCorrect: true
                    }, {
                        answerText: 'Контейнеры T774 серии.',
                        isCorrect: false
                    }, {
                        answerText: 'Контейнеры T103 серии.',
                        isCorrect: false
                    }, 
                ]
            }, {
                questionText: 'Какой ресурс комплекта чернил у четырехцветного Epson L4150?',
                answers: [
                    {
                        answerText: '7 500 цветных и 4 500 ч/б отпечатков.',
                        isCorrect: false
                    }, {
                        answerText: '4 500 цветных и 7 000 ч/б отпечатков.',
                        isCorrect: false
                    }, {
                        answerText: '6 000 цветных и 7 500 ч/б отпечатков.',
                        isCorrect: true
                    }, {
                        answerText: '3 500 цветных и 2 000 ч/б отпечатков.',
                        isCorrect: false
                    }, 
                ]
            }, {
                questionText: 'Какая гарантия дается на Epson L805?',
                answers: [
                    {
                        answerText: '1 год или 3 000 отпечатков.',
                        isCorrect: true
                    }, {
                        answerText: '1 год или 15 000 отпечатков.',
                        isCorrect: false
                    }, {
                        answerText: '1 год или 30 000 отпечатков.',
                        isCorrect: false
                    }, {
                        answerText: '1 год или 50 000 отпечатков.',
                        isCorrect: false
                    }, 
                ]
            }, {
                questionText: 'Какие дополнительные оттенки использует фотопринтер Epson L805?',
                answers: [
                    {
                        answerText: 'Светло-голубой и светло-пурпурный.',
                        isCorrect: true
                    }, {
                        answerText: 'Красный и синий.',
                        isCorrect: false
                    }, {
                        answerText: 'Серый и оранжевый.',
                        isCorrect: false
                    }, {
                        answerText: 'Фото черный и оптимизатор глянца.',
                        isCorrect: false
                    }, 
                ]
            }, {
                questionText: 'Какой ресурс комплекта чернил у Epson L805?',
                answers: [
                    {
                        answerText: '1 900 Фото 10 х 15.',
                        isCorrect: true
                    }, {
                        answerText: '1 000 Фото 10 х 15.',
                        isCorrect: false
                    }, {
                        answerText: '1 300 Фото 10 х 15.',
                        isCorrect: false
                    }, {
                        answerText: '1 500 Фото 10 х 15.',
                        isCorrect: false
                    }, 
                ]
            }, {
                questionText: 'Какое устройство ты порекомендуешь пользователю, которому нужен принтер для печати фотографий по Wi-Fi?',
                answers: [
                    {
                        answerText: 'Epson L805.',
                        isCorrect: true
                    }, {
                        answerText: 'Epson L3156.',
                        isCorrect: false
                    }, {
                        answerText: 'Epson L3100.',
                        isCorrect: false
                    }, {
                        answerText: 'Epson L3151.',
                        isCorrect: false
                    }, 
                ]
            }
        ]
    }
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
        // поменять элементы местами
        let t = array[i]; 
        array[i] = array[j]; 
        array[j] = t
    }
}