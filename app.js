// AngularJS Quiz Application
var app = angular.module('quizApp', []);

app.controller('QuizController', ['$scope', '$interval', function($scope, $interval) {
    // Quiz state
    $scope.quizStarted = false;
    $scope.quizFinished = false;
    $scope.currentQuestionIndex = 0;
    $scope.userAnswers = {};
    $scope.score = 0;
    $scope.scorePercentage = 0;
    $scope.timeRemaining = 3600; // 1 hour in seconds
    var timerInterval = null;

    // Load and shuffle questions
    $scope.questions = [];
    $scope.currentQuestion = null;

    // Initialize questions
    function initQuestions() {
        // Deep copy and shuffle questions
        $scope.questions = shuffleArray(angular.copy(quizQuestions));
        if ($scope.questions.length > 0) {
            $scope.currentQuestion = $scope.questions[0];
        }
    }

    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    // Initialize on load
    initQuestions();

    // Start the quiz
    $scope.startQuiz = function() {
        $scope.quizStarted = true;
        $scope.quizFinished = false;
        $scope.currentQuestionIndex = 0;
        $scope.userAnswers = {};
        $scope.timeRemaining = 3600;

        if ($scope.questions.length > 0) {
            $scope.currentQuestion = $scope.questions[0];
        }

        // Start timer
        if (timerInterval) {
            $interval.cancel(timerInterval);
        }
        timerInterval = $interval(function() {
            if ($scope.timeRemaining > 0) {
                $scope.timeRemaining--;
            } else {
                // Time's up - auto finish
                $scope.finishQuiz();
            }
        }, 1000);
    };

    // Format time as HH:MM:SS
    $scope.formatTime = function(seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var secs = seconds % 60;
        return (hours < 10 ? '0' : '') + hours + ':' +
               (minutes < 10 ? '0' : '') + minutes + ':' +
               (secs < 10 ? '0' : '') + secs;
    };

    // Get letter for option
    $scope.getLetter = function(index) {
        return String.fromCharCode(65 + index); // A, B, C, D...
    };

    // Select single answer
    $scope.selectSingleAnswer = function(index) {
        $scope.userAnswers[$scope.currentQuestion.id] = [index];
    };

    // Toggle multiple answer
    $scope.toggleMultipleAnswer = function(index) {
        var questionId = $scope.currentQuestion.id;
        if (!$scope.userAnswers[questionId]) {
            $scope.userAnswers[questionId] = [];
        }

        var idx = $scope.userAnswers[questionId].indexOf(index);
        if (idx === -1) {
            $scope.userAnswers[questionId].push(index);
        } else {
            $scope.userAnswers[questionId].splice(idx, 1);
        }
    };

    // Navigate to previous question
    $scope.previousQuestion = function() {
        if ($scope.currentQuestionIndex > 0) {
            $scope.currentQuestionIndex--;
            $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
        }
    };

    // Navigate to next question
    $scope.nextQuestion = function() {
        if ($scope.currentQuestionIndex < $scope.questions.length - 1) {
            $scope.currentQuestionIndex++;
            $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
        }
    };

    // Go to specific question
    $scope.goToQuestion = function(index) {
        $scope.currentQuestionIndex = index;
        $scope.currentQuestion = $scope.questions[index];
    };

    // Calculate score
    function calculateScore() {
        $scope.score = 0;
        for (var i = 0; i < $scope.questions.length; i++) {
            if ($scope.isQuestionCorrect($scope.questions[i])) {
                $scope.score++;
            }
        }
        $scope.scorePercentage = Math.round(($scope.score / $scope.questions.length) * 100);
    }

    // Check if question is correct
    $scope.isQuestionCorrect = function(question) {
        var userAnswer = $scope.userAnswers[question.id];
        var correctAnswer = question.correctAnswers;

        if (!userAnswer || userAnswer.length === 0) {
            return false;
        }

        // Check if arrays have same elements
        if (userAnswer.length !== correctAnswer.length) {
            return false;
        }

        var sortedUser = userAnswer.slice().sort();
        var sortedCorrect = correctAnswer.slice().sort();

        for (var i = 0; i < sortedUser.length; i++) {
            if (sortedUser[i] !== sortedCorrect[i]) {
                return false;
            }
        }

        return true;
    };

    // Finish the quiz
    $scope.finishQuiz = function() {
        // Stop timer
        if (timerInterval) {
            $interval.cancel(timerInterval);
            timerInterval = null;
        }

        calculateScore();
        $scope.quizStarted = false;
        $scope.quizFinished = true;
    };

    // Reset and restart quiz
    $scope.resetQuiz = function() {
        // Stop timer if running
        if (timerInterval) {
            $interval.cancel(timerInterval);
            timerInterval = null;
        }

        // Reset state
        $scope.quizStarted = false;
        $scope.quizFinished = false;
        $scope.currentQuestionIndex = 0;
        $scope.userAnswers = {};
        $scope.score = 0;
        $scope.scorePercentage = 0;
        $scope.timeRemaining = 3600;

        // Re-shuffle questions
        initQuestions();
    };

    // Cleanup on controller destroy
    $scope.$on('$destroy', function() {
        if (timerInterval) {
            $interval.cancel(timerInterval);
        }
    });
}]);
