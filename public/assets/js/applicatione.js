if (typeof Application == "undefined") {
  Application = {
    run: function () {
      this.showHideMenu();
      this.loadRoundResults();
      this.loadTableHomeAway();
      this.loadRoundRanking();
      this.configShowAllForms();
      if (typeof havingLivescore != "undefined" && havingLivescore == 1) {
        this.setLivescore();
      }
      this.configFcTab();
    },
    showHideMenu: function () {
      $("#show_menu").click(function () {
        $("#show_menu").addClass("hide");
        $("#hide_menu").removeClass("hide");
        $(".menu-list-item").removeClass("hide");
        if (!$(".form-search").hasClass("hide")) {
          $(".form-search").addClass("hide");
        }
      });
      $("#hide_menu").click(function () {
        $("#hide_menu").addClass("hide");
        $("#show_menu").removeClass("hide");
        $(".menu-list-item").addClass("hide");
      });
      $("#button_show_hide_search").click(function () {
        if (!$(".form-search").hasClass("hide")) {
          $("#button_show_hide_search").removeClass("click-active");
          $(".form-search").addClass("hide");
        } else {
          $("#button_show_hide_search").addClass("click-active");
          $(".form-search").removeClass("hide");
          if (!$("#hide_menu").hasClass("hide")) {
            $("#hide_menu").addClass("hide");
            $("#show_menu").removeClass("hide");
            $(".menu-list-item").addClass("hide");
          }
        }
      });
    },
    configShowAllForms: function () {
      if ($("a#show-all-forms").length) {
        $("a#show-all-forms").click(function () {
          $(".match-form-hidden").show();
        });
      }
    },
    configFcTab: function () {
      if ($(".change-home-tab").length) {
        $(".change-home-tab").click(function () {
          $(".change-home-tab").removeClass("active");
          $(this).addClass("active");
          var divActive = $(this).attr("rev");
          $("#home-form-all").hide();
          $("#home-form-home").hide();
          $("#" + divActive).show();
        });
      }
      if ($(".change-away-tab").length) {
        $(".change-away-tab").click(function () {
          $(".change-away-tab").removeClass("active");
          $(this).addClass("active");
          var divActive = $(this).attr("rev");
          $("#away-form-all").hide();
          $("#away-form-away").hide();
          $("#" + divActive).show();
        });
      }
    },
    loadRoundRanking: function () {
      if ($(".load-round-ranking").length) {
        var that = this;
        $(".load-round-ranking").click(function () {
          $(".load-round-data-active").removeClass("load-round-data-active");
          $(this).addClass("load-round-data-active");
          var groupValue = $(this).attr("rev");
          $("#zone-league-by-season-round").load(
            "/ajax/table_round/" + groupValue
          );
        });
      }
    },
    loadTableHomeAway: function () {
      if ($(".table-ranking-all").length) {
        $(".table-ranking-all").click(function () {
          $(".tab-match a.active").removeClass("active");
          $(this).addClass("active");
          $("#zone-table-away").hide();
          $("#zone-table-home").hide();
          $("#zone-table-all").show();
        });
        $(".table-ranking-home").click(function () {
          $(".tab-match a.active").removeClass("active");
          $(this).addClass("active");
          $("#zone-table-all").hide();
          $("#zone-table-away").hide();
          var currentClass = $("#zone-table-home").attr("class");
          if (currentClass == "loaded") {
            $("#zone-table-home").show();
          } else {
            var groupValue = $(this).attr("rev");
            $("#zone-table-home").load(
              "/ajax/table_home/" + groupValue,
              function () {
                $("#zone-table-home").show();
                $("#zone-table-home").addClass("loaded");
              }
            );
          }
        });
        $(".table-ranking-away").click(function () {
          $(".tab-match a.active").removeClass("active");
          $(this).addClass("active");
          $("#zone-table-all").hide();
          $("#zone-table-home").hide();
          var currentClass = $("#zone-table-away").attr("class");
          if (currentClass == "loaded") {
            $("#zone-table-away").show();
          } else {
            var groupValue = $(this).attr("rev");
            $("#zone-table-away").load(
              "/ajax/table_away/" + groupValue,
              function () {
                $("#zone-table-away").show();
                $("#zone-table-away").addClass("loaded");
              }
            );
          }
        });
      }
    },
    loadRoundResults: function () {
      if ($(".load-round-result").length) {
        var that = this;
        $(".load-round-result").click(function () {
          $(".load-round-data-active").removeClass("load-round-data-active");
          $(this).addClass("load-round-data-active");
          var groupValue = $(this).attr("rev");
          $("#zone-league-by-season-round").load("/ajax/result/" + groupValue);
        });
      }
      if ($(".load-round-schedule").length) {
        var that = this;
        $(".load-round-schedule").click(function () {
          $(".load-round-data-active").removeClass("load-round-data-active");
          $(this).addClass("load-round-data-active");
          var groupValue = $(this).attr("rev");
          $("#zone-league-by-season-round").load(
            "/ajax/schedule/" + groupValue
          );
        });
      }
    },
    setLivescore: function () {
      this.setLivescoreByTime();
      this.runLivescore();
    },
    setLivescoreByTime: function () {
      var that = this;
      setInterval(function () {
        that.runLivescore();
      }, 15000);
    },
    runLivescore: function () {
      var that = this;
      $.get("/files/tiktok.txt", function (response) {
        if (response) {
          var matches = response.split(";");
          var totalEle = matches.length;
          for (var i = 0; i < totalEle; i++) {
            that.applyChangeScore(matches[i]);
          }
          setTimeout(function () {
            $("span.match-score-change").removeClass("match-score-change");
          }, 1000);
        }
      });
    },
    applyChangeScore: function (oneChange) {
      var elements = oneChange.split(",");
      var divID = "match-id-" + elements[0];
      if ($("span#" + divID).length) {
        this.changeOneScoreCell("span#" + divID, elements[1]);
        this.changeOneScoreCell("span#" + divID + "-home-goal", elements[2]);
        this.changeOneScoreCell("span#" + divID + "-away-goal", elements[3]);
        var firstTimeHomeGoal =
          !elements[4] || 0 === elements[4].length ? elements[2] : elements[4];
        var firstTimeAwayGoal =
          !elements[5] || 0 === elements[5].length ? elements[3] : elements[5];
        this.changeOneScoreCell(
          "span#" + divID + "-ht-home-goal",
          firstTimeHomeGoal
        );
        this.changeOneScoreCell(
          "span#" + divID + "-ht-away-goal",
          firstTimeAwayGoal
        );
      }
    },
    changeOneScoreCell: function (selector, newVal) {
      var currentVal = $(selector).html();
      $(selector).html(newVal);
      if (currentVal != newVal) {
        $(selector).addClass("match-score-change");
      }
    },
  };
  Application.run();
}
var Liverscore = {
  setLivescore: function () {
    this.setLivescoreByTime();
    this.runLivescore();
  },
  setLivescoreByTime: function () {
    var that = this;
    setInterval(function () {
      that.runLivescore();
    }, 10000);
  },
  runLivescore: function () {
    var that = this;
    $.get(
      "/files/tiktok.txt",
      function (response) {
        if (response) {
          var totalEle = response.length;
          for (var i = 0; i < totalEle; i++) {
            that.applyChangeScore(response[i]);
          }
          setTimeout(function () {
            $("span.match-score-change").removeClass("match-score-change");
          }, 1000);
        }
      },
      "json"
    );
  },
  applyChangeScore: function (oneChange) {
    var elements = oneChange.split(",");
    var divID = "match-id-" + elements[0];
    if ($("span#" + divID).length) {
      this.changeOneScoreCell("span#" + divID, elements[1]);
      if (elements[6] > 0) {
        if ($("#home-name-" + elements[0] + " .red-card-show").length) {
          $("#home-name-" + elements[0] + " .red-card-show").text(elements[6]);
        } else {
          var homeName = $("#home-name-" + elements[0]).text();
          this.changeOneScoreCell(
            "#home-name-" + elements[0],
            '<i class="red-card-show">' + elements[6] + "</i>" + homeName
          );
        }
      }
      if (elements[7] > 0) {
        if ($("#away-name-" + elements[0] + " .red-card-show").length) {
          $("#away-name-" + elements[0] + " .red-card-show").text(elements[7]);
        } else {
          var awayName = $("#away-name-" + elements[0]).text();
          this.changeOneScoreCell(
            "#away-name-" + elements[0],
            awayName + '<i class="red-card-show">' + elements[7] + "</i>"
          );
        }
      }
      this.changeOneScoreCell("span#" + divID + "-home-goal", elements[2]);
      this.changeOneScoreCell("span#" + divID + "-away-goal", elements[3]);
      var firstTimeHomeGoal =
        !elements[4] || 0 === elements[4].length ? elements[2] : elements[4];
      var firstTimeAwayGoal =
        !elements[5] || 0 === elements[5].length ? elements[3] : elements[5];
      this.changeOneScoreCell(
        "span#" + divID + "-ht-home-goal",
        firstTimeHomeGoal
      );
      this.changeOneScoreCell(
        "span#" + divID + "-ht-away-goal",
        firstTimeAwayGoal
      );
    }
  },
  changeOneScoreCell: function (selector, newVal) {
    var currentVal = $(selector).html();
    $(selector).html(newVal);
    if (currentVal != newVal) {
      $(selector).addClass("match-score-change");
    }
  },
};
$(document).ready(function () {
  $(window).scroll(function () {
    if ($("#link-return-top").length > 0) {
      if (
        $(this).scrollTop() > 0 &&
        $("#link-return-top").css("visibility") == "hidden"
      ) {
        $("#link-return-top").css({ visibility: "visible" });
      } else if (
        $(this).scrollTop() == 0 &&
        $("#link-return-top").css("visibility") == "visible"
      ) {
        $("#link-return-top").css({ visibility: "hidden" });
      }
    }
  });
  if ($(".icon_new.icon-star").length) {
    $(document).on("click", ".icon_new.icon-star", function () {
      $(this).toggleClass("active");
      var idelementMain = $(this).data("id");
      var elementMain = $("#tb_" + idelementMain);
      var htmlClone = elementMain.clone();
      var isAddTop = false;
      var indexCurrent = elementMain.data("index");
      if (indexCurrent != "") {
        if ($(this).hasClass("active")) {
          isAddTop = true;
          elementMain.remove();
          if ($(".isTopYT").length > 0) {
            htmlClone.insertAfter($(".isTopYT")[$(".isTopYT").length - 1]);
            $("#tb_" + idelementMain).addClass("isTopYT");
          } else {
            htmlClone.insertAfter($("#tr_0"));
            $("#tb_" + idelementMain).addClass("isTopYT");
          }
        } else {
          elementMain.remove();
          $(".icon_new.icon-star").each(function () {
            if (!$(this).hasClass("active")) {
              var childIdElement = $(this).data("id");
              var indexE = $("#tb_" + childIdElement).data("index");
              if (indexCurrent < indexE) {
                htmlClone.insertBefore($("#tb_" + $(this).data("id")));
                $("#tb_" + idelementMain).removeClass("isTopYT");
                return false;
              }
            }
          });
        }
      }
      var arrIds = [];
      $(".icon_new.icon-star.active").each(function () {
        arrIds.push($(this).data("id"));
      });
      localStorage.setItem("favorite_ids", JSON.stringify(arrIds));
      $(".count-yeuthich").text(arrIds.length);
    });
    var favorite_ids = localStorage.getItem("favorite_ids");
    var count_favorite = 0;
    if (favorite_ids !== null) {
      favorite_ids = JSON.parse(favorite_ids);
      for (let index = 0; index < favorite_ids.length; index++) {
        $(".icon-star-" + favorite_ids[index]).addClass("active");
        count_favorite++;
      }
      $(".count-yeuthich").text(count_favorite);
    }
    $(".icon_new.icon-star.active").each(function () {
      var idelementMain = $(this).data("id");
      var elementMain = $("#tb_" + idelementMain);
      if (!elementMain.hasClass("item-ft")) {
        var htmlClone = elementMain.clone();
        elementMain.remove();
        if ($(".isTopYT").length > 0) {
          htmlClone.insertAfter($(".isTopYT")[$(".isTopYT").length - 1]);
          $("#tb_" + idelementMain).addClass("isTopYT");
        } else {
          htmlClone.insertAfter($("#tr_0"));
          $("#tb_" + idelementMain).addClass("isTopYT");
        }
      }
    });
  }
  if ($(".wr-info-tiso").length > 0) {
    $(".wr-info-tiso").hover(
      function () {
        var dataId = $(this).data("id");
        var dataType = $(this).data("type");
        if ($(this).find("div.tooltip").length > 0) {
          $(this).find("div.tooltip").show();
        } else {
          var html = '<div class="tooltip">';
          html +=
            '<div class="tooltip-title">' + $(this).data("title") + "</div>";
          html +=
            '<div class="tooltip-body" id="c-tooltip-' + dataId + '"></div>';
          html += "</div>";
          $(this).append(html);
        }
        $("#c-tooltip-" + dataId).html(
          '<p class="text-center">Loadding...</p>'
        );
        $.get(
          "/livescore/ajax-detail?id=" + dataId + "&type=" + dataType,
          function (res) {
            $("#c-tooltip-" + dataId).html(res);
          }
        );
      },
      function () {
        $(this).find("div.tooltip").hide();
      }
    );
  }
  if ($(".tyso-corner").length > 0) {
    $(".tyso-corner").hover(
      function () {
        var dataId = $(this).data("id");
        var dataType = $(this).data("type");
        if ($(this).find("div.tooltip").length > 0) {
          $(this).find("div.tooltip").show();
        } else {
          var html = '<div class="tooltip">';
          html +=
            '<div class="tooltip-title">' + $(this).data("title") + "</div>";
          html +=
            '<div class="tooltip-body" id="c-tooltip-corner-' +
            dataId +
            '"></div>';
          html += "</div>";
          $(this).append(html);
        }
        $("#c-tooltip-corner-" + dataId).html(
          '<p class="text-center">Loadding...</p>'
        );
        $.get(
          "/livescore/ajax-detail?id=" + dataId + "&type=" + dataType,
          function (res) {
            $("#c-tooltip-corner-" + dataId).html(res);
          }
        );
      },
      function () {
        $(this).find("div.tooltip").hide();
      }
    );
  }
  if ($(".home-tab").length > 0) {
    $(".home-tab").click(function () {
      if (!$(this).parent().hasClass("active")) {
        var type = $(this).data("type");
        if (type.length == 0) {
          return false;
        }
        $(".home-tab").each(function () {
          $(this).parent().removeClass("active");
        });
        $(this).parent().addClass("active");
        if (type == "all") {
          $(".item-live-home").show();
          $("#lv2_title_results").show();
        } else if (type == "live") {
          $(".item-live-home").hide();
          $("#lv2_title_results").hide();
          $(".item-live-home.item-tructiep").show();
        } else if (type == "hot") {
          $(".item-live-home").hide();
          $("#lv2_title_results").show();
          $(".item-live-home.match-hot").show();
        } else if (type == "yeuthich") {
          $(".item-live-home").hide();
          $("#lv2_title_results").show();
          $(".item-live-home").each(function () {
            if ($(this).find(".icon-star.active").length > 0) {
              $(this).show();
            }
          });
        } else if (type == "filter-league") {
          onFilterLeague(true);
        }
      }
    });
  }
  if ($(".data-history-ls").length > 0) {
    $(".data-history-ls").click(function () {
      $("#myModal-bdn").show();
      if (
        $(this).data("href") != $("#modal-bdn-content").attr("data-content")
      ) {
        $("#modal-bdn-content").html('<p class="text-center">Loadding...</p>');
        $("#modal-bdn-content").attr("data-content", $(this).data("href"));
        $.get($(this).data("href"), function (res) {
          $("#modal-bdn-content").html(res);
        });
      }
    });
  }
  if ($(".set-sound-data").length > 0) {
    $(".set-sound-data").click(function () {
      if ($(this).hasClass("muted")) {
        $(this).removeClass("muted");
        LiverscoreNew.setRunAudio("1");
      } else {
        $(this).addClass("muted");
        LiverscoreNew.setRunAudio("0");
      }
    });
  }
  setEventsMatchDetail();
});
function setEventsMatchDetail() {
  $(".checkbox-bet-company").change(function () {
    $(".checkbox-bet-company").each(function () {
      var betId = $(this).data("id");
      if ($(this).prop("checked")) {
        $(".row-data-bet-company-" + betId).show();
      } else {
        $(".row-data-bet-company-" + betId).hide();
      }
    });
  });
  $(".checkbox-bet-company-1x2").change(function () {
    $(".checkbox-bet-company-1x2").each(function () {
      var betId = $(this).data("id");
      if ($(this).prop("checked")) {
        $(".row-data-bet-company-1x2-" + betId).show();
      } else {
        $(".row-data-bet-company-1x2-" + betId).hide();
      }
    });
  });
  $(".h2h-input").change(function () {
    var form = $(this).closest("form");
    var data = $(form).serialize();
    $.ajax({
      url: "/livescore/ajax-head-to-head",
      dataType: "json",
      type: "POST",
      data: data,
      beforeSend: function () {
        $(".wait").show();
      },
      success: function (res) {
        if (res.status == 1) {
          var formId = form.attr("id");
          $("." + formId + "-html").html(res.html);
        }
      },
      error: function (xhr, status, error) {
        console.log(xhr.statusText);
        console.log(status);
        console.log(error);
      },
    });
  });
  $(".btn-player-statistic").click(function () {
    var table = $(this).data("table");
    $(".btn-player-statistic").removeClass("active");
    $(this).addClass("active");
    $(".player-statistic-table").hide();
    $("#" + table).show();
  });
  $(".btn-player-statistic-away").click(function () {
    var table = $(this).data("table");
    $(".btn-player-statistic-away").removeClass("active");
    $(this).addClass("active");
    $(".player-statistic-table-away").hide();
    $("#" + table).show();
  });
  $(".btn-odds-type").click(function () {
    var table = $(this).data("table");
    $(".btn-odds-type").removeClass("active");
    $(this).addClass("active");
    $(".odds-type-box").hide();
    $("#" + table).show();
  });
  $(".btn-odds-ftht").click(function () {
    var type = $(this).data("type");
    $(".btn-odds-ftht").removeClass("active");
    $(this).addClass("active");
    $(".odds-3in1-wrap").hide();
    $(".odds-3in1-wrap-" + type).show();
  });
  $(".btn-odds-type-1x2").click(function () {
    var type = $(this).data("type");
    $(".btn-odds-type-1x2").removeClass("active");
    $(this).addClass("active");
    $(".odds-1x2-row").hide();
    $("." + type).show();
  });
  $(".btn-odds-liveodds").click(function () {
    var type = $(this).data("type");
    $(".btn-odds-liveodds").removeClass("active");
    $(this).addClass("active");
    $(".odds-liveodds").hide();
    $(".odds-liveodds-" + type).show();
  });
  $(".btn-odds-teamstats").click(function () {
    var type = $(this).data("type");
    $(".btn-odds-teamstats").removeClass("active");
    $(this).addClass("active");
    $(".match-team-stats").hide();
    $(".match-team-stats-" + type).show();
  });
  $(".btn-odds-compare-odds").click(function () {
    var type = $(this).data("type");
    $(".btn-odds-compare-odds").removeClass("active");
    $(this).addClass("active");
    $(".compare-odds-value").hide();
    $(".compare-odds-value-" + type).show();
  });
  $(".btn-odds-statistic-asia").click(function () {
    var type = $(this).data("type");
    $(".btn-odds-statistic-asia").removeClass("active");
    $(this).addClass("active");
    $(".match-standing-team").hide();
    $(".match-standing-team-" + type).show();
  });
  $(".btn-odds-statistic-asia-type").click(function () {
    var type = $(this).data("type");
    $(".btn-odds-statistic-asia-type").removeClass("active");
    $(this).addClass("active");
    $(".match-statistic-row-hdp").addClass("hidden");
    $(".match-statistic-row-tx").addClass("hidden");
    $(".match-statistic-row-" + type).removeClass("hidden");
  });
}
function onFilterLeague(on) {
  if (on) {
    $(".bdwr-filter-league").show();
  } else {
    $(".bdwr-filter-league").hide();
  }
}
function SelectFilterLeague(check) {
  $(".radio-filterLea").prop("checked", check);
}
function DoFilterLeague() {
  var leagueIds = [];
  $(".radio-filterLea").each(function () {
    if ($(this).prop("checked")) {
      leagueIds.push($(this).val());
    }
  });
  $(".item-live-home").each(function () {
    var leagueId = $(this).data("league") + "";
    console.log(leagueIds.indexOf(leagueId));
    if (leagueIds.indexOf(leagueId) != -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
  onFilterLeague(false);
  $(".home-tab").parent().removeClass("active");
  $(".home-tab.filter-league").parent().addClass("active");
}
function changeBetCompany(elm) {
  var betId = $(elm).val();
  $(".oddsTable tbody").hide();
  $("#odds-live-" + betId).show();
}
function chooseNumbermatch(elm) {
  var number = $(elm).data("number");
  $(".choose-number-match").removeClass("active");
  $(elm).addClass("active");
  $(".match-goal-body").hide();
  $("#match-result-goal-" + number).show();
}
function deleteRowBetCompany(betId) {
  $(".row-data-bet-company-" + betId).hide();
  $("#bet-company-" + betId).prop("checked", false);
}
function delete1x2RowBetCompany(betId) {
  $(".row-data-bet-company-1x2-" + betId).hide();
  $("#bet-company-1x2-" + betId).prop("checked", false);
}
function compareChangeNumberMatch(elm, homeId, awayId) {
  var numMatch = $(elm).val();
  var data = { numMatch: numMatch, homeId: numMatch, awayId: awayId };
  $.ajax({
    url: "/livescore/ajax-compare-data",
    dataType: "json",
    type: "GET",
    data: data,
    beforeSend: function () {
      $(".wait").show();
    },
    success: function (res) {
      if (res.status == 1) {
        $(".compare-data-body").html(res.html);
      }
    },
    error: function (xhr, status, error) {
      console.log(xhr.statusText);
      console.log(status);
      console.log(error);
    },
  });
}
function loadData3in1ByCompany(betCompanyId, matchId) {
  var data = { betCompanyId: betCompanyId, matchId: matchId };
  $.ajax({
    url: "/livescore/ajax-data-threeinone",
    dataType: "json",
    type: "GET",
    data: data,
    beforeSend: function () {
      $(".wait").show();
    },
    success: function (res) {
      if (res.status == 1) {
        $(".btn-odds-bet-company").removeClass("active");
        $(".btn-odds-bet-company-" + betCompanyId).addClass("active");
        $(".btn-odds-ftht[data-type=ft]").addClass("active");
        $(".btn-odds-ftht[data-type=ht]").removeClass("active");
        $(".odds-3in1-wrap-total").html(res.html);
      }
    },
    error: function (xhr, status, error) {
      console.log(xhr.statusText);
      console.log(status);
      console.log(error);
    },
  });
}
