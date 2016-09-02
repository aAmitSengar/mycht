(function() {
    "use strict";
    /* Controllers */
    function ChatController($rootScope, $scope, socket, $window, $anchorScroll, $location) {
        var vm = this;
        $rootScope.login = true;
        vm.loggedinUser = new Object();
        $scope.usrlist = [];
        $window.width = "100px";
        $scope.decodeType = 'colon';
        $scope.emojiMessage = {};
        vm.sendChatonEnter = false;
        $scope.scrollopts = {
            wheelSpeed: 1,
            wheelPropagation: true,
            minScrollbarLength: 10
        };
        const notifier = require('node-notifier');
        const path = require('path');
        const remote = require('electron').remote;

        notifier.on('click', function(notifierObject, options) {
            //console.log(options);
            // Triggers if `wait: true` and user clicks notification
            //  if (document.hidden) {
            var window = remote.getCurrentWindow();
            window.focus();
            //  }
            vm.ShowChat(options.user, 0);
        });

        notifier.on('timeout', function(notifierObject, options) {
            // Triggers if `wait: true` and notification closes
            //  alert(2);
        });

        function notifyMe(notifyobjj) {

            var windowsNotification = new Notification(notifyobjj.memberName, {
                body: notifyobjj.Msg,
                icon: path.join(__dirname, '..', 'public', 'img', 'twc-logo.png')
            });
            windowsNotification.onshow = function() {
                //    alert("Notification shown")
            };
            windowsNotification.onclick = function() {
                var window = remote.getCurrentWindow();
                window.focus();
                for (var i = 0; i < $scope.usrlist.length; i++) {
                    if ($scope.usrlist[i].appId == notifyobjj.appId && $scope.usrlist[i].memberId == notifyobjj.memberId) {
                        vm.ShowChat($scope.usrlist[i], 0);
                        break;
                    }
                }
            };
            windowsNotification.onclose = function() {
                //alert("Notification dismissed")
            };


            // notifier.notify({
            //     'title': notifyobjj.memberName,
            //     'subtitle': "New Message",
            //     'message': notifyobjj.Msg,
            //     'sound': true, // Case Sensitive string for location of sound file, or use one of OS X's native sounds (see below)
            //     'icon': path.join(__dirname, '../public/img/twc-logo.png'), // Absolute Path to Triggering Icon
            //     'contentImage': '../icon.ico', // Absolute Path to Attached Image (Content Image)
            //     'open': void 0, // URL to open on Click
            //     'wait': true, // Wait for User Action against Notification
            //     'user': notifyobjj
            // }, function(error, response) {
            //     console.log(response);
            // });

        }
        /*Privere functions */
        function isUserAlreadyExist(newmember) {
            return filterArray = $scope.usrlist.filter(function(el) {
                return el.memberId === newmember.memberId && el.appId === newmember.appId;
            });
        }
        /*Privere functions */
        /*-----------------------------------------Start::setChatUserList---------------------------------------------------------------*/
        /*------------------------------------Testing Purpose------------------*/
        // function setChatUserList(userId) {
        //     socket.emit("userlist", userId);
        //     //  console.log(userlist);
        // }
        // socket.on("userlist", function(userlist) {
        //     $scope.usrlist = userlist;
        //     //console.log(userlist);
        // });
        /*------------------------------------Testing Purpose------------------*/
        /*------------------------------------Live------------------*/
        function GetOnlineUsers(myID) {
            socket.emit("getConnectedUsers", myID);
        }
        socket.on("onGetConnectedUsers", function(onlineUsers) {
            console.log(onlineUsers);
            $scope.usrlist = onlineUsers;
        });
        socket.on("memberConnected", function(newmember) {
            console.log(newmember);
            var IsmemberAlreadyExist = false;
            var index = -1;
            for (var i = 0; i < $scope.usrlist.length; i++) {
                if ($scope.usrlist[i].appId == newmember.appId && $scope.usrlist[i].memberId == newmember.memberId) {
                    IsmemberAlreadyExist = true;
                    index = i;
                    break;
                }
            }
            if (IsmemberAlreadyExist && index >= 0) {
                $scope.usrlist[index] = newmember;
                //  $scope.usrlist[index].LastMsgTime = Mymsg.msgDate;
                $scope.usrlist[index].UnreadCount = 1;
                $scope.usrlist[index].IsOnline = true;
                //  $scope.usrlist[index].LastMsg = Mymsg.Msg;
            } else {
                newmember.UnreadCount = 0;
                newmember.IsOnline = true;
                newmember.LastMsg = newmember.message;
                $scope.usrlist.push(newmember);
            }
        });

        function UpdateMsgCount(Mymsg) {
            for (var i = 0; i < $scope.usrlist.length; i++) {
                if ($scope.usrlist[i].appId == Mymsg.appId && $scope.usrlist[i].memberId == Mymsg.memberId) {
                    if ($scope.usrlist[i].UnreadCount) {
                        $scope.usrlist[i].LastMsgTime = Mymsg.msgDate;
                        $scope.usrlist[i].UnreadCount += 1;
                        if (Mymsg.sendBy == $rootScope.loggedinUser.UserType) {
                            //  $scope.currentUser.IsOnline = true;
                        } else {
                            $scope.usrlist[i].IsOnline = true;
                        }
                        $scope.usrlist[i].LastMsg = Mymsg.Msg; /*Comment this if wants to show only first msg*/
                        break;
                    } else {
                        $scope.usrlist[i].LastMsgTime = Mymsg.msgDate;
                        $scope.usrlist[i].UnreadCount = 1;
                        if (Mymsg.sendBy == $rootScope.loggedinUser.UserType) {
                            //  $scope.currentUser.IsOnline = true;
                        } else {
                            $scope.usrlist[i].IsOnline = true;
                        }
                        //  if (!Mymsg.Msg) /*Comment this if wants to show only first msg*/ {
                        $scope.usrlist[i].LastMsg = Mymsg.Msg;
                        //  }
                        break;
                    }
                }
            }
        }
        socket.on("receiveMessege", function(receivedMsg) {
            if (!$scope.currentUser || !(receivedMsg.appId == $scope.currentUser.appId && receivedMsg.memberId === $scope.currentUser.memberId) || document.hidden) {
                notifyMe(receivedMsg);
            }
            if ($scope.currentUser) {
                if (receivedMsg) {
                    if (receivedMsg.appId == $scope.currentUser.appId && receivedMsg.memberId === $scope.currentUser.memberId) {
                        receivedMsg.LastMsgTime = receivedMsg.msgDate;
                        receivedMsg.UnreadCount = 0;
                        if (receivedMsg.sendBy == $rootScope.loggedinUser.UserType) {
                            //  $scope.currentUser.IsOnline = true;
                        } else {
                            $scope.currentUser.IsOnline = true;
                        }
                        $scope.currentUser.LastMsg = receivedMsg.Msg;
                        $scope.chats.push(receivedMsg);
                        //$scope.gotoAnchor();
                    } else {
                        UpdateMsgCount(receivedMsg);
                    }
                }
            } else {
                UpdateMsgCount(receivedMsg);
            }

            //  $scope.usrlist.push(newmember);
        });
        socket.on("memberDisconnected", function(disconnectedUser) {
            for (var i = 0; i < $scope.usrlist.length; i++) {
                if ($scope.usrlist[i].appId == disconnectedUser.appId && $scope.usrlist[i].memberId == disconnectedUser.memberId) {
                    $scope.usrlist[i].IsOnline = false;
                    break;
                }
            }
        });
        /*------------------------------------Live------------------*/
        /*-----------------------------------------End::setChatUserList---------------------------------------------------------------*/

        function setHeight() {
            try {
                document.getElementsByClassName("dr-list-wrap")[0].style.height = ($window.innerHeight - 110) + 'px';
                document.getElementsByClassName("right-chat")[0].style.height = ($window.innerHeight - 55) + 'px';
                document.getElementsByClassName("full-chat-inner")[0].style.height = ($window.innerHeight - 155) + 'px';
            } catch (e) {
                console.log(e);
            } finally {

            }

        }
        $rootScope.onResize = function() {
            setHeight();
        };
        $window.onresize = $rootScope.onResize;
        /*--PREVENT RELOAD
        $rootScope.beforeUnload = function () {alert('hahah')};

        $window.beforeunload = $rootScope.onResize;
        */

        /*-----------------------------------------Start::Init---------------------------------------------------------------*/
        function Init() {
            if ($rootScope.isLogedIn == false) {
                $location.path("/login");
            } else {
                vm.loggedinUser = $rootScope.loggedinUser;
                //  setChatUserList(vm.loggedinUser.UserID);
                GetOnlineUsers(vm.loggedinUser.UserID);
            }
            setHeight();
        }
        Init();
        /*-----------------------------------------End::Init---------------------------------------------------------------*/
        $scope.gotoAnchor = function() {
            if ($scope.chats) {
                var x = $scope.chats.length - 1;
                var newHash = 'anchor' + x;
                if ($location.hash() !== newHash) {
                    // set the $location.hash to `newHash` and $anchorScroll will automatically scroll to it
                    $location.hash('anchor' + x);
                } else {
                    // call $anchorScroll() explicitly, since $location.hash hasn't changed
                    $anchorScroll();
                }
            }
        };
        /*-----------------------------------------Start::On Click Show Chat---------------------------------------------------------------*/
        function showChat(usr, idx) {
            $scope.currentUser = usr;

            var currentmember = {
                memberId: usr.memberId,
                appId: usr.appId,
                expertType: vm.loggedinUser.UserType
            };
            $scope.currentUser.UnreadCount = 0;
            socket.emit("userLastSession", currentmember);
            for (var i = 0; i < $scope.usrlist.length; i++) {
                if ($scope.usrlist[i].appId == $scope.currentUser.appId && $scope.usrlist[i].memberId == $scope.currentUser.memberId) {
                    $scope.usrlist[i].UnreadCount = 0;
                }
            }
        }
        socket.on("onUserLastSession", function(oldchats) {
            console.log(oldchats);
            $scope.chats = oldchats;
            setTimeout(function() {
                $(".nano").nanoScroller({
                    scroll: 'bottom'
                });
            }, 1000);

        });
        /*-----------------------------------------End::On Click Show Chat---------------------------------------------------------------*/
        $scope.emojiMessage.replyToUser = function() {
            if ($scope.emojiMessage.rawhtml.length > 0) {
                var msgToSend = $scope.currentUser;
                msgToSend.message = $scope.emojiMessage.messagetext;
                socket.emit("sendMessageByExpert", $scope.currentUser);
                $scope.emojiMessage.rawhtml = "";
                $scope.emojiMessage.messagetext = "";
            }
            //  alert('You typed ' + $scope.emojiMessage.messagetext);
        }
        socket.on("disconnect", function() {
            if ($rootScope.isLogedIn == false) {
                //$location.path("/login");
            } else {
                alert("client disconnected from server");
                socket.emit("login", $rootScope.user);
            }
        });
        vm.ShowChat = showChat;
    }
    angular.module("myApp").controller("ChatController", ChatController);
    ChatController.$inject = ["$rootScope", "$scope", "socket", "$window", "$anchorScroll", "$location"]
})();
