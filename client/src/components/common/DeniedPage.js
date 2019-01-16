import React from "react";

export default function DeniedPage() {
  return (
    <div className="denied-page">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">
              <span className="font-weight-bold text-danger">
                Permission Denied!{" "}
              </span>
              You're not allowed to access this page.
            </h1>
            <a href="/dashboard">
              <button className="btn btn-primary mt-2">Back to Home</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
