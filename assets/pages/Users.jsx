/* eslint-disable react/prop-types */
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"

import Paper from "@material-ui/core/Paper"
import AddIcon from "@material-ui/icons/Add"
import Button from "@material-ui/core/Button"

import YaxysClue, { queries } from "../services/YaxysClue"
import { withConstants } from "../services/Utils"

import Loader from "../components/Loader.jsx"
import Wrapper from "../components/Wrapper.jsx"
import Created from "../components/Created.jsx"
import ModelTable from "../components/ModelTable.jsx"
import ModelDialog from "../components/ModelDialog.jsx"

const usersClue = props => ({ identity: "user", query: queries.FIND, sort: { id: 1 }, populate: "profiles" })
const usersSelector = YaxysClue.selectors.byClue(usersClue)

const CREATED_USERS_MARKER = "users-page"
const createdUsersSelector = YaxysClue.selectors.byClue(
  props => ({ identity: "user", query: queries.CREATE }),
  { marker: CREATED_USERS_MARKER }
)

@withConstants
@connect(
  (state, props) => ({
    users: usersSelector(state, props),
    createdUsers: createdUsersSelector(state, props),
  }),
  {
    loadUsers: YaxysClue.actions.byClue,
    createUser: YaxysClue.actions.byClue,
  }
)
export default class Users extends Component {
  state = {
    addOpen: false,
  }

  componentDidMount() {
    this.props.loadUsers(usersClue(this.props))
  }

  onAdd = event => {
    this.setState({ addOpen: true })
  }

  onAddClose = () => {
    this.setState({ addOpen: false })
  }

  onAddReady = values => {
    this.setState({ addOpen: false })

    this.props.createUser(
      {
        identity: "user",
        query: queries.CREATE,
        data: values,
      },
      { marker: CREATED_USERS_MARKER }
    )
  }

  render() {
    const { constants, users } = this.props
    return (
      <Wrapper breadcrumbs={["Users"]}>
        <Button
          variant="fab"
          color="secondary"
          onClick={this.onAdd}
          style={{ float: "right" }}
          title="Create user"
        >
          <AddIcon />
        </Button>
        <h1 style={{ marginTop: 0 }}>Users</h1>
        <p>
          Also, you can control users&#39; rights by{" "}
          <Link to={"/settings/user-profiles"}>managing their profiles</Link>
        </p>
        <Created
          items={this.props.createdUsers}
          content={user => user.name}
          url={user => `/users/${user.id}`}
        />
        <Loader item={users}>
          <Paper>
            <ModelTable
              schema={constants.schemas.user}
              data={(users && users.data) || []}
              url={user => `/users/${user.id}`}
              columns={["id", "name", "hasCustomRights", "profiles"]}
            />
          </Paper>
        </Loader>
        <br />
        <ModelDialog
          title="Create new user"
          open={this.state.addOpen}
          onClose={this.onAddClose}
          onReady={this.onAddReady}
          schema={constants.schemas.user}
          attributes={["name"]}
          btnReady="Create"
        >
          Please provide name for the new user.
        </ModelDialog>
      </Wrapper>
    )
  }
}