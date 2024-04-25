import React from "react";
import DialogContentText from "@material-ui/core/DialogContentText";
import { makeStyles } from "@material-ui/core/styles";
import { initializeTwilioClient } from "../helper/TwilioClientHelper";
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
  ModalHeader,
  ModalHeading,
} from "@twilio-paste/core";
import { InputContainer } from "./Containers";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Action, ActionType } from "../state/Actions";

const useStyles = makeStyles(() => ({
  dialogTitleStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "left",
    alignItems: "center",
  },
  logoStyle: {
    height: "50px",
    width: "50px",
    marginRight: "10px",
  },
}));

function WelcomeDialogComponent(props: { setSessionInitialized: () => void }) {
  require("dotenv").config();

  if (
    process.env.REACT_APP_ACCOUNT_SID &&
    process.env.REACT_APP_AUTH_TOKEN &&
    process.env.REACT_APP_WORKSPACE_SID &&
    process.env.REACT_APP_WORKFLOW_SID
  ) {
    try {
      initializeTwilioClient(
        process.env.REACT_APP_ACCOUNT_SID,
        process.env.REACT_APP_AUTH_TOKEN,
        process.env.REACT_APP_WORKSPACE_SID,
        process.env.REACT_APP_WORKFLOW_SID
      );
      props.setSessionInitialized();
    } catch (error) {
      // TODO: add form validation and remove alert
      alert(error);
    }
  }

  const classes = useStyles();

  const initialFormData = Object.freeze({
    accountSid: process.env.REACT_APP_ACCOUNT_SID!!,
    authToken: process.env.REACT_APP_AUTH_TOKEN!!,
    workspaceSid: process.env.REACT_APP_WORKSPACE_SID!!,
    workflowSid: process.env.REACT_APP_WORKFLOW_SID!!,
  });

  const [formData, updateFormData] = React.useState(initialFormData);

  const handleChange = (e: any) => {
    updateFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = () => {
    try {
      initializeTwilioClient(
        formData.accountSid,
        formData.authToken,
        formData.workspaceSid,
        formData.workflowSid
      );
      props.setSessionInitialized();
    } catch (error) {
      // TODO: add form validation and remove alert
      alert(error);
    }
  };

  return (
    <div>
      <Modal
        ariaLabelledby={"modalHeadingID"}
        isOpen={true}
        aria-labelledby="edit-apartment"
        onDismiss={() => {}}
        size="default"
      >
        <ModalHeader id="welcomeDialog">
          <div className={classes.dialogTitleStyle}>
            <img
              src="./taskrouter-logo-red.svg"
              alt="TaskRouter Logo"
              className={classes.logoStyle}
            />
            <ModalHeading as="h1" id="modalHeadingID">
              TaskRouter Demo Tool
            </ModalHeading>
          </div>
        </ModalHeader>
        <ModalBody>
          <DialogContentText>
            Please enter following data to start:
          </DialogContentText>
          <InputContainer>
            <Label htmlFor="accountSid" required>
              Account SID
            </Label>
            <Input
              autoFocus
              id="accountSid"
              placeholder={
                !formData.accountSid
                  ? "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  : formData.accountSid
              }
              type="text"
              onChange={handleChange}
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="authToken" required>
              Auth Token
            </Label>
            <Input
              id="authToken"
              placeholder={
                !formData.authToken
                  ? "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  : formData.authToken
              }
              type="password"
              onChange={handleChange}
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="workspaceSid" required>
              Workspace SID
            </Label>
            <Input
              id="workspaceSid"
              placeholder={
                !formData.workspaceSid
                  ? "WSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  : formData.workspaceSid
              }
              type="text"
              onChange={handleChange}
            />
          </InputContainer>
          <Label htmlFor="workflowSid" required>
            Workflow SID
          </Label>
          <Input
            id="workflowSid"
            placeholder={
              !formData.workflowSid
                ? "WWXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                : formData.workflowSid
            }
            type="text"
            onChange={handleChange}
          />
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button onClick={handleSubmit} variant="primary">
              Submit
            </Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
    </div>
  );
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    setSessionInitialized: bindActionCreators(
      () => dispatch({ type: ActionType.SESSION_INITIALIZED }),
      dispatch
    ),
  };
};

export const WelcomeDialog = connect(
  null,
  mapDispatchToProps
)(WelcomeDialogComponent);
