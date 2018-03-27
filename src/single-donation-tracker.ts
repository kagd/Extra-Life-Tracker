import * as $ from 'jquery';

interface IState {
  positionInRotation: number;
}

interface ISettings {
  participantIds: number[];
  displayCount: number;
  teamId: string;
  refreshTimeMS: number;
  logWhenUpdating: boolean;
}

interface IParticipant {
  displayName: string;
  totalRaisedAmount: number;
  fundraisingGoal: number;
  participantID: number;
  createdOn: string;
  avatarImageURL: string;
  timestamp: number;
  teamID: number;
  isTeamCaptain: boolean;
}

interface IApiParams {
  fuseaction: string;
  participantID: number;
  format: 'json';
  timestamp: string | number;
}

interface ICallApi {
  fuseaction: string;
  participantID: number;
}

class SingleDonationTracker {
  static baseURL = "https://www.extra-life.org/index.cfm";
  static currencyOptions = {
    formatWithSymbol: true,
    precision: 0,
    separator: ',',
  };
  state: IState;
  settings: ISettings;
  refreshIntervalId?: number;

  constructor(settings: ISettings) {
    this.state = {
      positionInRotation: 0,
    };
    this.settings = settings;
    if (this.settings.displayCount > this.settings.participantIds.length || this.settings.displayCount < 1) {
      this.settings.displayCount = settings.participantIds.length;
    }
  }

  /* Initial setup of the layout and theme based on user settings */
  start() {
    /* Call updateParticipants to do initial populate and then repeat at interval */
    this.updateParticipants();
    this.refreshIntervalId = setInterval(this.updateParticipants, this.settings.refreshTimeMS);
  }

  updateParticipants() {
    const displayingParticipants: number[] = [];
    const {
      participantIds,
    } = this.settings;

    for (let i = 0; i < this.settings.displayCount; i++) {
        displayingParticipants.push(participantIds[this.state.positionInRotation]);

        if (this.state.positionInRotation === participantIds.length - 1) {
          this.state.positionInRotation = 0;
        } else {
          this.state.positionInRotation += 1;
        }
    }

    const participantResults: IParticipant[] = [];

    for (let i = 0; i < displayingParticipants.length; i++) {
      const params = {
        fuseaction: 'donordrive.participant',
        participantID: displayingParticipants[i],
      };

      this.callAPI(params, (result: IParticipant) => {
        participantResults.push(result);

        if (participantResults.length === displayingParticipants.length) {
          $("#participant-trackers").html("");

          for (let j = 0; j < displayingParticipants.length; j++) {
            for (let k = 0; k < participantResults.length; k++) {
              if (participantResults[k].participantID === displayingParticipants[j]) {
                this.makeParticipantTracker(participantResults[k]);
              }
            }
          }
        }
      });
    }
  }

  makeParticipantTracker(participantData: IParticipant) {
    // Temp
    participantData.totalRaisedAmount = Math.random() * 1000;
    participantData.fundraisingGoal = 1000;
    // end Temp
    const barWidth = Math.round(participantData.totalRaisedAmount / participantData.fundraisingGoal * 100);
    const amtRaised = this.toCurrency(participantData.totalRaisedAmount) + " / " + this.toCurrency(participantData.fundraisingGoal);

    const tracker = $(`
      <div class="participant-tracker-container">
        <div class="raised-bar" style="width:'${barWidth}%;'"></div>
        <div class="name">${ participantData.displayName }</div>
        <div class="raised">${ amtRaised }</div>
      </div>`);

    tracker.appendTo('#participant-trackers');
  }

  callAPI(data: ICallApi, callback: (participant: IParticipant) => any) {
    const params = {
      type: 'GET',
      dataType: 'json',
      url: SingleDonationTracker.baseURL,
      data: {
        ...data,
        format: 'json',
        timestamp: new Date().getTime(),
      },
      success: function(response: IParticipant) {
        callback(response);
      },
    };

    $.ajax(params);
  }

  isEmpty(value: any) {
    return (value == null || value === "");
  }

  toCurrency( value: number | string ) {
    return (window as any).currency(value, SingleDonationTracker.currencyOptions).format();
  }
}

(window as any).SingleDonationTracker = SingleDonationTracker;
