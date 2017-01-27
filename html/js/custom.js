$(document).on('ready',function(){

    $('.login-form').on('submit', function(e){
        e.preventDefault();
        var username = $('input[name=username]').val(),
            password = $('input[name=password]').val(),
            submit = $('button[type=submit]'),
            load =  $(this).find('.load-box');

        if(username && password){
            load.addClass('active');
        }

        $.ajax({
            url: 'api/v1/login',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
                "username": username,
                "password": password
            }),
            success: function (data) {
                if(data.code === 0){
                    $.ajax({
                        url: 'api/v1/worlds',
                        type: 'GET',
                        contentType: "application/json",
                        success: function (d) {
                            if(d.code === 0){
                                if(d.data.length){
                                    var worlds = '';

                                    $.each(d.data, function(i, world){
                                        worlds += '<div class="world-row" data-id="' + world.worldId + '">';
                                        worlds += '<div class="worldName">' + world.worldName + '</div>';
                                        worlds += '<div class="era inline">Эпоха ' + world.era + '</div>';
                                        worlds += '<div class="eraDay inline">День ' + world.eraDay + '/14</div>';
                                        if(world.cityName){
                                            worlds += '<div class="eraDay inline">Город ' + world.cityName + '</div>';
                                        }
                                        worlds += '<div class="playersOnline inline">Онлайн ' + world.playersOnline + '</div>';
                                        worlds += '<div class="clear"></div>';
                                        worlds += '</div>';
                                    });

                                    $('.worlds-list').html(worlds);
                                    $('.worlds-list-box').addClass('active');
                                    load.removeClass('active');
                                }
                            }
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    });
                }else{
                    console.log('error');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });


    });

    $('body').on('click', '.world-row', function(e){
        e.preventDefault();
        var worldID = $(this).attr('data-id'),
            load = $('.worlds-list-box .load-box');

        load.addClass('active');
        console.log('Click, world ID - ' + worldID);

        $.ajax({
            url: '/api/v1/join/'+worldID,
            type: 'GET',
            contentType: "application/json",
            success: function (data) {
                if(data.code === 0){
                    $('.world-box').addClass('active');
                }else{
                    alert(data.message);
                }
                load.removeClass('active');
            },
            error: function (data) {
                console.log(data);
            }
        });


    });

    $('.world-menu .station').on('click', function(e){
        e.preventDefault();


        $.ajax({
            url: '/api/v1/station/',
            type: 'GET',
            contentType: "application/json",
            success: function (data) {
                if(data.code === 0){
                    var html = '<div class="station-box table">';
                    $.each(data.data, function(i, build){
                        html += '<div class="build-row table-row">';
                        html += '<div class="build-name">' + build.name + '</div>';
                        html += '<div class="build-lvl">' + build.level + '</div>';
                        if(build.build_in_progress){
                            html += '<div class="build-progress">' + build.build_finish_at + '</div>';
                        }
                        if(build.video_watched){
                            html += '<div class="build-video-watched"><i class="fa fa-video-camera"></i></div>';
                        }
                        html += '<div class="clear"></div>';
                        html += '</div>';
                    });

                    console.log('click');

                    $('.center-body').html(html);

                }else{
                    alert(data.message);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });


    });

});
