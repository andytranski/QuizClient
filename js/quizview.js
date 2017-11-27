$(document).ready(() => {
    //Load current user object with id
    const currentUser = SDK.currentUser();
    const userId = currentUser.userId;

    //Display logout button on menu
    $(".navbar-right").html(`
        <li><a href="#" id="logout-link">Log out</a></li>
    `);

    //Show specific panel for admin
    if (currentUser.type === 1) {
        //Set the menu bar with admin rights
        $("#tabs").html(" <li><a href=\"newquiz.html\">New quiz</a></li>\n" +
            "                    <li><a href=\"courseview.html\">All quiz</a></li>");

        //SDK request to load quizzes
        SDK.loadQuizzes((err, quiz) => {
            if (err) throw err;
            //Save quiz list div as a constant
            const $quizList = $("#quizList");
            const course = SDK.Storage.load("chosenCourse");
            var quizzes = JSON.parse(quiz);

            //Display course title on header
            $(".page-header").html(`<h1>${course.courseTitle}</h1>`);


            /*
            For every quiz object in the array a panel
            will be added to the quiz list. The panel
            consist of quiz information and button.
             */
            quizzes.forEach(quiz => {
                const quizHtml = `
        <div class="col-lg-4 quiz-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                <!-- Use quiz title as header inside panel -->
                    <h3 class="panel-title">${quiz.quizTitle}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-4">
                    </div>
                    <div class="col-lg-8">
                      <dl>
                        <!-- Set the information about the quiz -->
                        <dt>Quiz</dt>
                        <dd>${quiz.quizTitle}</dd>
                        <dt>Quiz ID</dt>
                        <dd>${quiz.quizId}</dd>
                        <dt>Created By</dt>
                        <dd>${quiz.createdBy}</dd>
                         <dt>Questions</dt>
                        <dd>${quiz.questionCount}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4"></div>
                        <div class="col-lg-8 text-right style="height: 46px;">
                            <!-- Create buttons inside panel with course id reference --> 
                            <button class="btn btn-primary quiz-button" data-quiz-id="${quiz.quizId}">Choose</button>
                            <button class="btn btn-danger delete-button" data-quiz-id="${quiz.quizId}"><span class="glyphicon glyphicon-trash"></span> </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
                $quizList.append(quizHtml);
            });

            //Listener on quiz button
            $('.quiz-button').on('click', function () {
                /*
                Refer to the exact button clicked and save id.
                Use find attribute to locate the id and save the
                chosen quiz object with same id.
                 */
                const thisQuizId = $(this).data("quiz-id");
                const quiz = quizzes.find(q => q.quizId === thisQuizId);

                SDK.Storage.persist("chosenQuiz", quiz);

                //SDK reqest to load questions
                SDK.loadQuestions((err, question) => {
                    if (err) throw err;
                    const questions = JSON.parse(question)

                    /*
                    Load modal with questions.
                    The modal is created to only register click
                    on button. Therefore esc and click outside
                    the modal is not recognized.
                     */
                    $('#quizModal').removeData("modal").modal({backdrop: 'static', keyboard: false})
                    $('#quizModal').modal('show');

                    //Save question table div as a constant
                    const $questionTableBody = $("#questionTableBody");

                    //For each question loop print out question
                    $.each(questions, function (key, val) {
                        var tr = '<tr>';
                        tr += '<td >' + questions[key].question + '</td>';
                        tr += '</tr>';
                        $questionTableBody.append(tr);

                    });

                    //Listener on dismiss button to empty table
                    $("#dismissButton").on("click", () => {
                        $questionTableBody.empty();
                    });
                })
            });

            //Listener on delete button
            $('.delete-button').on('click', function () {
                /*
                Refer to the exact button clicked and save id.
                Use find attribute to locate the id and save the
                chosen quiz object with same id.
                 */
                const thisQuizId = $(this).data("quiz-id");
                const quiz = quizzes.find(q => q.quizId === thisQuizId);

                SDK.Storage.persist("chosenQuiz", quiz);

                //SDK request to delete quiz and reload HTML page
                SDK.deleteQuiz((err, data) => {
                    location.reload();
                });


            });
        });
        //Show specific panel for user
    } else if (currentUser.type === 2) {
        //Set the menu bar with user rights
        $("#tabs").html("<li><a href=\"usercourseview.html\">All quiz</a></li>");
        //SDK request to load quizzes

        SDK.loadQuizzes((err, quiz) => {
            if (err) throw err;

            //Save quiz list div as a constant
            var $quizList = $("#quizList");
            const course = SDK.Storage.load("chosenCourse")
            var quizzes = JSON.parse(quiz);

            //Display course title on header
            $(".page-header").html(`<h1>${course.courseTitle}</h1>`);

            /*
            For every quiz object in the array a panel
            will be added to the quiz list. The panel
            consist of quiz information and button.
             */
            quizzes.forEach(quiz => {
                const quizHtml = `
        <div class="col-lg-4 quiz-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <!-- Use quiz title as header inside panel -->
                    <h3 class="panel-title">${quiz.quizTitle}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-4">
                    </div>
                    <div class="col-lg-8">
                      <dl>
                      <!-- Set the information about the quiz -->
                        <dt>Quiz</dt>
                        <dd>${quiz.quizTitle}</dd>
                        <dt>Created By</dt>
                        <dd>${quiz.createdBy}</dd>

                         <dt>Questions</dt>
                        <dd>${quiz.questionCount}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4"></div>
                        <div class="col-lg-8 text-right">
                        <!-- Create button inside panel with course id reference -->
                            <button class="btn btn-primary quiz-button" data-quiz-id="${quiz.quizId}">Choose</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
                $quizList.append(quizHtml);
            });

            //Listener on quiz button
            $('.quiz-button').on('click', function () {
                /*
                Refer to the exact button clicked and save id.
                Use find attribute to locate the id and save the
                chosen quiz object with same id.
                 */
                const thisQuizId = $(this).data("quiz-id");
                const quiz = quizzes.find(q => q.quizId === thisQuizId);

                SDK.Storage.persist("chosenQuiz", quiz);
                window.location.href = "startquiz.html";
            });

        });
    }
    //Listener on log out button
    $("#logout-link").click(() => {
        SDK.logOut(userId, (err, data) => {
            if (err && err.xhr.status == 401) {
                $(".form-group").addClass("has-error");
            } else {
                //Clear the local storage upon log out
                window.location.href = "login.html";
                SDK.Storage.remove("User")
                SDK.Storage.remove("token")
            }
        })
    });
});

