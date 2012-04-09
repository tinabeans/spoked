
var initPromise = $.when(initData());

function initMain() {
	console.log("initMain");

	$template = $('#game-template');
	for (var i = 0; i < games.length; i++) {
		var game = games[i];
		if (game.stop > getTime()) { continue; }
		console.log(game.name);
		initGame(game);
		var activeUsers = [];
		for (var j = 0; j < users.length; j++) {
			if (isUserInGame(users[j], game)) { activeUsers.push(users[j]); }
		}
		aggregateGameTrackData(game);
		var totalSmiles = 0;
		for (var j = 0; j < activeUsers.length; j++) {
			totalSmiles += activeUsers[j].totalSmiles;
		}
		var $instance = $template.clone().removeClass('template').attr('id', null).css({display: ''});
		$instance.attr('href', 'main.html?' + game.id);
		$instance.find('.game-name').text(game.name);
		$instance.find('.game-smiles').text(humanUnits(Math.round(totalSmiles / M_PER_MI), "smile", true));
		$instance.find('.game-duration').text(game.humanDuration);
		if (game.players[0].team) {
			console.log("teams");
		}
		else {
			var winner = null;
			for (var j = 0; j < activeUsers.length; j++) {
				if (!winner || activeUsers[j].totalSmiles > winner.totalSmiles) { winner = activeUsers[j]; }
			}
			var $team = $('<div class="individuals"></div>');
			for (var j = 0; j < activeUsers.length; j++) {
				var avatarHtml = '<img class="avatar" src="img/avatar/' + activeUsers[j].slug + '.jpg" />';
				if (activeUsers[j] == winner) {
					$team.append($('<div class="individual-winner">' + avatarHtml + '</div>'));
				}
				else {
					$team.append($(avatarHtml));
				}
			}
			$instance.find('.game-text').append($team);
		}
		$instance.insertAfter($('.game-root').last());
	}
}

$(function() {
	$('.template').css({display: 'none'});

	$('.logout').click(sessionLogout);

	initPromise.done(initMain);
});
