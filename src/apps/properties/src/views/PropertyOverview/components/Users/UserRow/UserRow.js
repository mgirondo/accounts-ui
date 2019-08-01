import { PureComponent } from 'react'

import { updateRole, removeUser } from '../../../../../store/sitesUsers'
import { zConfirm } from '../../../../../../../../shell/store/confirm'
import { notify } from '../../../../../../../../shell/store/notifications'

import { DropDownFieldType } from '@zesty-io/core/DropDownFieldType'
import { Button } from '@zesty-io/core/Button'

import styles from './UserRow.less'
export default class UserRow extends PureComponent {
  state = {
    submitted: false
  }
  render() {
    return (
      <article className={styles.UserRow}>
        <span className={styles.name}>
          {this.props.firstName} {this.props.lastName}
        </span>

        <span className={styles.email}>{this.props.email}</span>

        <span className={styles.action}>
          {this.state.submitted ? (
            <Loader />
          ) : (
            <React.Fragment>
              {this.props.isAdmin ? (
                // for admins render options to modify users
                this.props.role.name === 'Owner' ? (
                  // if the role is owner the role is rendered with no dropdown
                  <React.Fragment>
                    <i className="fas fa-crown"></i>
                    <span className={styles.Owner}>Owner</span>
                  </React.Fragment>
                ) : (
                  // render a dropdown to change roles
                  <DropDownFieldType
                    name="siteRoles"
                    onChange={this.handleSelectRole}
                    selection={
                      this.props.siteRoles
                        .filter(role => role.ZUID === this.props.role.ZUID)
                        .map(item => item.ZUID)[0]
                    }
                    options={this.props.siteRoles.map(role => {
                      return {
                        value: role.ZUID,
                        text: role.name
                      }
                    })}
                  />
                )
              ) : // Render text only for non-permissioned users
              this.props.role.name === 'Owner' ? (
                <React.Fragment>
                  <i className="fas fa-crown"></i>
                  &nbsp;{this.props.role.name}
                </React.Fragment>
              ) : (
                this.props.role.name
              )}
            </React.Fragment>
          )}
        </span>

        {/* only owners can delete another owner */}
        {this.props.isAdmin &&
          (this.props.role.name === 'Owner' ? (
            this.props.isOwner && (
              <Button
                kind="cancel"
                onClick={() =>
                  this.removeUserFromInstance(
                    this.props.ZUID,
                    this.props.role.ZUID
                  )
                }>
                <i className={'fas fa-user-minus'} />
              </Button>
            )
          ) : (
            <Button
              kind="cancel"
              onClick={() =>
                this.removeUserFromInstance(
                  this.props.ZUID,
                  this.props.role.ZUID
                )
              }>
              <i className={'fas fa-user-minus'} />
            </Button>
          ))}
      </article>
    )
  }
  removeUserFromInstance = (userZUID, roleZUID) => {
    this.props.dispatch(
      zConfirm({
        prompt: 'Are you sure you want to remove this user?',
        callback: result => {
          if (result) {
            this.props
              .dispatch(removeUser(this.props.siteZUID, userZUID, roleZUID))
              .then(() => {
                this.props.dispatch(
                  notify({
                    message: 'User Removed',
                    type: 'success'
                  })
                )
              })
              .catch(err => {
                this.props.dispatch(
                  notify({
                    message: 'Error Removing User',
                    type: 'error'
                  })
                )
              })
          }
        }
      })
    )
  }

  handleSelectRole = evt => {
    this.setState({
      submitted: true
    })
    this.props
      .dispatch(
        updateRole(
          this.props.siteZUID,
          this.props.ZUID,
          evt.target.dataset.value
        )
      )
      .then(data => {
        this.setState({
          submitted: false
        })
        this.props.dispatch(
          notify({
            message: `${this.props.firstName}'s role has been updated`,
            type: 'success'
          })
        )
      })
      .catch(err => {
        this.props.dispatch(
          notify({
            message: 'There was a problem updating the role',
            type: 'error'
          })
        )
      })
  }
}
