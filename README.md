# saint-peter-react-mui
This package provides a set of react components that can be used to interact with a [saint-perter](https://www.npmjs.com/package/saint-peter) authentication server.

## App
This is the main component. By using this component you don't need to use any of the other ones.

Props:
- *authServerURL*: URL of the server providing authentication
- *mainComponent*: component to display. If **routes** is provided, this component will be fed children accordingly
- *mainPath*: path corrensponding to the **mainComponent** (default `app`)
- *routes*: optional array of [react-router](https://github.com/ReactTraining/react-router) Routes. They will be sub-paths of the **mainPath**
- *adminGroup*: group whose users are allowed to add/edit other users (default `admin`)
- *history*: one of browserHistory or hashHistory. See [react-router](https://github.com/ReactTraining/react-router) for details

