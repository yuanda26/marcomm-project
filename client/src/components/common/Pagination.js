import React, { Component } from "react";
import PropTypes from "prop-types";
// Material IU Pagination
import { withStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage
} from "@material-ui/icons";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class Pagination extends Component {
  handleFirstPageButtonClick = e => {
    this.props.onChangePage(e, 0);
  };

  handleBackButtonClick = e => {
    this.props.onChangePage(e, this.props.page - 1);
  };

  handleNextButtonClick = e => {
    this.props.onChangePage(e, this.props.page + 1);
  };

  handleLastPageButtonClick = e => {
    this.props.onChangePage(
      e,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
        </IconButton>
      </div>
    );
  }
}

Pagination.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

const PaginationWrapper = withStyles(actionsStyles, {
  withTheme: true
})(Pagination);

export default PaginationWrapper;
