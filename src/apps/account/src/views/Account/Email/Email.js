import React, { Component } from "react";
import { connect } from "react-redux";
import { updateSetting, addEmail } from "../../../store";
import styles from "./email.less";

class Email extends Component {
  handleChange = evt => {
    if (evt.target.value.match(evt.target.pattern)) {
      this.props.dispatch(
        updateSetting({ [evt.target.name]: evt.target.value })
      );
    }
  };
  handleClick = e => {
    this.props.dispatch(addEmail());
  };
  render() {
    return (
      <section className={styles.profileEmail}>
        <h2>Emails</h2>
        <div>
          <div className="info">
            <p>
              <strong>Tip: Why set up multiple emails?</strong>
            </p>
            <p>
              Setting up multiple emails lets you accept all of your account
              invitations in one place.
            </p>
          </div>
          <div className={styles.emailTable}>
            <footer>
              <Input
                type="text"
                placeholder="wont@work.com"
                name="newEmail"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
                value={this.props.newEmail}
                onChange={this.handleChange}
              />
              <Button text="Add Email" onClick={this.handleClick} />
            </footer>
            <header>
              <h3>Email</h3>
              <h3>Options</h3>
            </header>
            <main>
              <article>
                <span>{this.props.email} </span>
                <span>
                  {this.props.email === this.props.EmailsVerified
                    ? "Verified"
                    : "Unverified"}
                </span>
              </article>
              {this.props.EmailsUnverified ? (
                <article>
                  <span>
                    {this.props.EmailsUnverified}
                  </span>
                  <span>Unverified</span>
                </article>
              ) : null}
            </main>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    email: state.profile.email,
    EmailsVerified: state.profile.EmailsVerified,
    EmailsUnverified: state.profile.EmailsUnverified
  };
};

export default connect(mapStateToProps)(Email);
