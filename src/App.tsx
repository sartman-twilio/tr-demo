import React from "react";
import { WelcomeDialog } from "./components/WelcomeDialog";
import { makeStyles } from "@material-ui/core/styles";
import { Queue } from "./model/Queue";
import {
  getActivities,
  getDefaultChannelSid,
  getQueues,
} from "./helper/TwilioClientHelper";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { MainTable } from "./components/MainTable";
import { EventSourceComponent } from "./components/EventSourceComponent";
import { TaskRouterDemoToolState } from "./state/State";
import { Action, ActionType } from "./state/Actions";
import { Theme } from "@twilio-paste/core/theme";
import { Activity } from "./model/Activity";
import { Spinner } from "@twilio-paste/core";
import { Box } from "@material-ui/core";
import { mergeMap } from "rxjs/operators";

const useStyles = makeStyles(() => ({
  containerStyle: {
    backgroundImage: "url(/bricks-bg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    height: "100%",
  },
}));

const AppComponent = (props: {
  sessionInitialized: boolean;
  resourcesFetched: boolean;
  updateQueues: (queues: Queue[]) => void;
  updateActivities: (
    availableActivity: Activity,
    unavailableActivity: Activity
  ) => void;
  setResourcesFetched: () => void;
}) => {
  const classes = useStyles();
  document.body.classList.add(classes.containerStyle);

  React.useEffect(() => {
    if (props.sessionInitialized) {
      // Fetch queues
      getDefaultChannelSid()
        .pipe(mergeMap((defaultChannelSid) => getQueues(defaultChannelSid)))
        .subscribe((queues) => {
          props.updateQueues(queues);
          props.setResourcesFetched();
        });

      // Get activities (we don't need them to show main table, thus not waiting for them to be fetched)
      getActivities().subscribe((activities) =>
        props.updateActivities(
          activities.filter((activity) => activity.available)[0],
          activities.filter((activity) => !activity.available)[0]
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sessionInitialized]);

  if (!props.sessionInitialized) {
    return (
      <Theme.Provider theme="default">
        <AttributionLink />
        <WelcomeDialog />
      </Theme.Provider>
    );
  } else if (!props.resourcesFetched) {
    return (
      <Theme.Provider theme="default">
        <AttributionLink />
        <Box top="50%" left="50%" position="fixed">
          <Spinner size="sizeIcon110" decorative={false} title="Loading" />
        </Box>
      </Theme.Provider>
    );
  } else {
    return (
      <Theme.Provider theme="default">
        <AttributionLink />
        <EventSourceComponent />
        <MainTable />
      </Theme.Provider>
    );
  }
};

const AttributionLink = () => (
  <a href="https://www.freepik.com/photos/background">
    Background photo created by mrsiraphol - www.freepik.com
  </a>
);

const mapStateToProps = (state: TaskRouterDemoToolState) => {
  return {
    sessionInitialized: state.sessionInitialized,
    resourcesFetched: state.resourcesFetched,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    updateQueues: bindActionCreators(
      (queues: Queue[]) =>
        dispatch({
          type: ActionType.QUEUES_UPDATED,
          queues: queues,
        }),
      dispatch
    ),
    updateActivities: bindActionCreators(
      (availableActivity: Activity, unavailableActivity: Activity) =>
        dispatch({
          type: ActionType.ACTIVITIES_UPDATED,
          availableActivity: availableActivity,
          unavailableActivity: unavailableActivity,
        }),
      dispatch
    ),
    setResourcesFetched: bindActionCreators(
      () => dispatch({ type: ActionType.RESOURCES_FETCHED }),
      dispatch
    ),
  };
};

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
