import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import "./App.css";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

const PARTICLES_OPTIONS = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

const initialState = {
  input: "",
  imageUrl: "",
  box: [],
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    fetch("https://stormy-wildwood-86341.herokuapp.com").then(
      (response) => response
    );
  }

  inputChangeHandler = (event) => {
    this.setState({ input: event.target.value });
  };

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    const clarifaiFacesArray = [];
    for (let i = 0; i < data.outputs[0].data.regions.length; i++) {
      let clarifaiFace =
        data.outputs[0].data.regions[i].region_info.bounding_box;
      const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      const clarifaiFaceObj = {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
      clarifaiFacesArray.push(clarifaiFaceObj);
    }
    return clarifaiFacesArray;
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  submitButtonHandler = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("https://stormy-wildwood-86341.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch("https://stormy-wildwood-86341.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  routeChangeHandler = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className='App'>
        <Particles className='particles' params={PARTICLES_OPTIONS} />
        <Navigation
          isSignedIn={isSignedIn}
          routeChangeHandler={this.routeChangeHandler}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              inputChangeHandler={this.inputChangeHandler}
              submitButtonHandler={this.submitButtonHandler}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <SignIn
            loadUser={this.loadUser}
            routeChangeHandler={this.routeChangeHandler}
          />
        ) : (
          <Register
            loadUser={this.loadUser}
            routeChangeHandler={this.routeChangeHandler}
          />
        )}
      </div>
    );
  }
}

export default App;
