import {TranslationConsumer} from "@datawheel/tesseract-explorer";
import {Button, Flex, Group, Text, Title} from "@mantine/core";
import React from "react";

interface State {
  message: string;
  name: string;
}

interface Props {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error) {
    return {message: error.message, name: error.name};
  }

  state = {
    message: "",
    name: ""
  };

  clearError = () => this.setState({message: "", name: ""});

  render() {
    const {message, name} = this.state;

    if (!message) {
      return this.props.children;
    }

    return (
      <TranslationConsumer>
        {({translate: t}) => {

          const detailText = t("error.detail");

          return (
            <Flex p="xl" align="center" justify="center" direction="column" className="chart-card error">
              <Title order={3}>{t("error.title")}</Title>
              {detailText.length ? <Text>{detailText}</Text> : null}
              <Text>{t("error.message", {message})}</Text>
              <Group spacing="xs" my="sm">
                <Button
                  onClick={this.clearError}
                  size="xs"
                  variant="light"
                >
                  {t("action_retry")}
                </Button>
                <Button error={name} message={message} />
              </Group>
            </Flex>
          );
        }}
      </TranslationConsumer>
    );
  }
}
