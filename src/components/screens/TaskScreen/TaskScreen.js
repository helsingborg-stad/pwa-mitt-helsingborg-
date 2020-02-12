import React, { Component } from 'react';
import styled from 'styled-components';

import { NavItems, CompletedTasks, ActiveTasks } from '../../../assets/dashboard';
import forms from '../../../assets/forms';
import GroupedList from '../../molecules/GroupedList';
import { COMPLETED_FORMS_KEY, USER_KEY, getData } from '../../../services/StorageServiceNew';
import TasksContext from '../../../context/tasks-context';

import Header from '../../molecules/Header';
import ScreenWrapper from '../../molecules/ScreenWrapper';
import ListItem from '../../molecules/ListItem';

import { Heading, Text } from '../../atoms';

const TaskScreenWrapper = styled(ScreenWrapper)`
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  paddingbottom: 0;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 180px;
  overflow: auto;
`;

const List = styled.div`
  margin-top: 24px;
`;

const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

class TaskScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      activeTasks: [],
    };
  }

  componentDidMount() {
    this.getUser();
    this.getTasks();
  }

  sortTasksByDate = list => list.sort((a, b) => new Date(b.created) - new Date(a.created));

  getTasks = () => {
    const tasks = getData(COMPLETED_FORMS_KEY);
    this.setState({
      activeTasks: Array.isArray(tasks) && tasks.length ? this.sortTasksByDate(tasks) : [],
    });
  };

  getUser = () => {
    const user = getData(USER_KEY);
    this.setState({ user });
  };

  renderTaskItem = item => {
    const { history } = this.props;
    const { user } = this.state;

    const form = forms.find(form => form.id === item.formId);
    if (!form) {
      return null;
    }

    return (
      <ListItem
        key={item.id}
        highlighted
        title="Ansökan"
        text={form.name}
        iconName={form.icon || null}
        imageSrc={form.imageIcon || null}
        onClick={() => history.push(`/tasks/${item.id}`)}
      />
    );
  };

  render() {
    const { tasks } = this.context;
    const { user, activeTasks } = this.state;

    return (
      <TaskScreenWrapper>
        {/* <NavigationEvents onWillFocus={() => this.getTasks()} /> */}

        <Header
          title="Mitt Helsingborg"
          message={user && user.givenName ? `Hej ${user.givenName}!` : 'Hej!'}
          themeColor="purple"
          navItems={NavItems}
        />
        <Container>
          <List>
            <ListHeading type="h3">Aktiva</ListHeading>
            {tasks.length > 0 ? (
              tasks.map(this.renderTaskItem)
            ) : (
              <Text style={{ marginLeft: 4 }}>Inga aktiva ärenden..</Text>
            )}
          </List>

          <List>
            <GroupedList heading="Avslutade" items={CompletedTasks} />
          </List>
        </Container>
      </TaskScreenWrapper>
    );
  }
}

TaskScreen.contextType = TasksContext;

export default TaskScreen;
