const serverBaseURL = 'https://urishorty.herokuapp.com';
const mainElement = document.getElementById('main');
let email = localStorage.getItem('email');
let token = localStorage.getItem('token');
let listOfURLID = [];

let sweetAlertShowCustom = (title, message, type) => {
  return swal({
    title: title,
    text: message,
    type: type,
    button: "Close" // Text on button
    //built in icons: success, warning, error, info
  });
}

let loader = () => {
  mainElement.innerHTML = `<div class="d-flex justify-content-center align-items-center" style="height:100vmin;"><img class="img-fluid" src="./assets/images/Pulse-1s-200px.gif"/></div>`;
}

let loaderWithin = (ele) => {
  document.getElementById(ele).innerHTML = `<div class="d-flex justify-content-center align-items-center" style="height:100vmin;"><img class="img-fluid" src="./assets/images/Pulse-1s-200px.gif"/></div>`;
}


let autoSignIn = () => {
  if (localStorage.getItem('email') && localStorage.getItem('token')) {
    navigateToDashboard(email, token);
  } else {
    navigateToinitialPage();
  }
}

let checkIfSignedIn = () => {
  return localStorage.getItem('email') && localStorage.getItem('token');
}


let signOut = () => {
  localStorage.removeItem('email');
  localStorage.removeItem('token');
  email = null;
  token = null;
  loader();
  setTimeout(() => {
    autoSignIn();
  }, 500)

}

let deleteURI = (uriId) => {
  let indexofURI = listOfURLID.indexOf(uriId);

  let uri = uriId.replace('DELURL_', '');
  loaderWithin('create-url-tab');
  (async () => {
    try {
      const response = await fetch(`${serverBaseURL}/${uri}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
          'redirect': 'follow'
        }
      });
      const data = await response.json();
      if (response.status == 200) {
        listOfURLID.splice(indexofURI, 1)
        // alert('Short Uri Deleted Successfully')
        sweetAlertShowCustom('Success Deleted!', 'Short Uri Deleted Successfully', 'success');
        setTimeout(() => {
          navigateToDashboard();
        }, 500);
      } else {
        throw data;
      }
      return;

    } catch (err) {
      if (err.error) {
        // alert(err.error);
        sweetAlertShowCustom('Error Deleting!', err.error, 'error');
        location.reload();
        return;
      }
      // alert(err)
      sweetAlertShowCustom('Error Deleting!', err, 'error');
      location.reload();
      return;
    }
  })();
}

let generateChartForDashboard = (chartData) => {
  const ctx = document.getElementById('myChart').getContext('2d');
  const lineGraphChartData = chartData.map(el => {
    const { day, month, year } = el._id;
    const { count } = el;
    console.log(moment(`${year} ${month} ${day}`, 'YYYY MM DD'));
    return {
      x: moment(`${year} ${month} ${day}`, 'YYYY MM DD'),
      y: count
    };
  });
  let color = Chart.helpers.color;
  console.log(lineGraphChartData);


  let chartCfg = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Urls',
        backgroundColor: "rgb(245, 66, 111)",
        borderColor: "rgb(245, 66, 111)",
        fill: false,
        radius: 6,
        pointRadius: 6,
        capBezierPoints: true,
        stepped: true,
        data: lineGraphChartData
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Short Urls Created by you at uriShorty'
      },
      scales: {
        xAxes: [{
          type: 'time',
          display: true,
          distribution: 'linear',
          time: {
            displayFormats: {
              'millisecond': 'MMM DD',
              'second': 'MMM DD',
              'minute': 'MMM DD',
              'hour': 'MMM DD',
              'day': 'MMM DD',
              'week': 'MMM DD',
              'month': 'MMM DD',
              'quarter': 'MMM DD',
              'year': 'MMM DD',
            },
            unit: 'day',
            tooltipFormat: 'll HH:mm'
          },
          scaleLabel: {
            display: true,
            labelString: 'Date'
          },
          ticks: {
            major: {
              fontStyle: 'bold',
              fontColor: '#FF0000'
            },
            beginAtZero: true
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'value'
          },
          ticks: {
            min: 0,
            beginAtZero: true,
            stepSize: 2
          }
        }]
      }
    }
  };



  // let chartCfg = {
  //   data: {
  //     datasets: [{
  //       label: 'uriShorty',
  //       backgroundColor: "rgb(245, 66, 111)",
  //       borderColor: "rgb(245, 66, 111)",
  //       data: lineGraphChartData,
  //       type: 'line',
  //       pointRadius: 0,
  //       fill: false,
  //       lineTension: 0,
  //       borderWidth: 2
  //     }]
  //   },
  //   options: {
  //     animation: {
  //       duration: 0
  //     },
  //     scales: {
  //       xAxes: [{
  //         type: 'time',
  //         distribution: 'series',
  //         offset: true,
  //         ticks: {
  //           major: {
  //             enabled: true,
  //             fontStyle: 'bold'
  //           },
  //           source: 'data',
  //           autoSkip: true,
  //           autoSkipPadding: 75,
  //           maxRotation: 0,
  //           sampleSize: 100
  //         },
  //         afterBuildTicks: function (scale, ticks) {
  //           var majorUnit = scale._majorUnit;
  //           var firstTick = ticks[0];
  //           var i, ilen, val, tick, currMajor, lastMajor;

  //           val = moment(ticks[0].value);
  //           if ((majorUnit === 'minute' && val.second() === 0)
  //             || (majorUnit === 'hour' && val.minute() === 0)
  //             || (majorUnit === 'day' && val.hour() === 9)
  //             || (majorUnit === 'month' && val.date() <= 3 && val.isoWeekday() === 1)
  //             || (majorUnit === 'year' && val.month() === 0)) {
  //             firstTick.major = true;
  //           } else {
  //             firstTick.major = false;
  //           }
  //           lastMajor = val.get(majorUnit);

  //           for (i = 1, ilen = ticks.length; i < ilen; i++) {
  //             tick = ticks[i];
  //             val = moment(tick.value);
  //             currMajor = val.get(majorUnit);
  //             tick.major = currMajor !== lastMajor;
  //             lastMajor = currMajor;
  //           }
  //           return ticks;
  //         }
  //       }],
  //       yAxes: [{
  //         gridLines: {
  //           drawBorder: false
  //         },
  //         scaleLabel: {
  //           display: true,
  //           labelString: 'Number of URLs Per day'
  //         }
  //       }]
  //     },
  //     tooltips: {
  //       intersect: false,
  //       mode: 'index',
  //       callbacks: {
  //         label: function (tooltipItem, myData) {
  //           var label = myData.datasets[tooltipItem.datasetIndex].label || '';
  //           if (label) {
  //             label += ': ';
  //           }
  //           label += parseFloat(tooltipItem.value).toFixed(2);
  //           return label;
  //         }
  //       }
  //     }
  //   }
  // }
  let chart = new Chart(ctx, chartCfg);

  // let chart = new Chart(ctx, {
  //   type: 'line',
  //   data: lineGraphChartData,
  //   options: {
  //     scales: {
  //       xAxes: [{
  //         type: 'time',
  //         time: {
  //           displayFormats: {
  //             'millisecond': 'MMM DD',
  //             'second': 'MMM DD',
  //             'minute': 'MMM DD',
  //             'hour': 'MMM DD',
  //             'day': 'MMM DD',
  //             'week': 'MMM DD',
  //             'month': 'MMM DD',
  //             'quarter': 'MMM DD',
  //             'year': 'MMM DD',
  //           },
  //           unit: 'month',
  //           tooltipFormat: 'll HH:mm',
  //           unitStepSize: 1,
  //           minUnit: 'day'
  //         },
  //         ticks: {
  //           beginAtZero: true,
  //           stepSize: 1
  //         }
  //       }],
  //       yAxes: [{
  //         ticks: {
  //           max: 25,
  //           min: 0,
  //           stepSize: 1
  //         }
  //       }]
  //     }
  //   }
  // });

  console.log(chart);
}

let generateInnerHTMLForHome = (resData) => {
  let cardsArray = [];

  for (let c of resData) {
    const { day, month, year } = c._id;
    const { count, urls } = c;
    let date = new Date(year, month - 1, day);
    let fullDate = date.toLocaleDateString();
    let dateNum = fullDate.replace(/\//g, '');
    let divAccordionLinks = [];

    for (let url of urls) {
      let linkURL = url.url.includes('www.') ? `https://${url.url}` : url.url;
      let urlDiv = `<div><a href="${linkURL}" target="_blank">${url.shortUrl}</a></div>`
      divAccordionLinks.push(urlDiv);
    }

    let divAccordCards = `
    <div class="card">
    <div class="card-header" id="heading${dateNum}">
      <h2 class="mb-0">
        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapse${dateNum}" aria-expanded="false" aria-controls="collapse${dateNum}">
        <div class="d-flex justify-content-between">
        <span>${fullDate}</span><span>${count}</span>      
        </div>        
        </button>
      </h2>
    </div>
    <div id="collapse${dateNum}" class="collapse" aria-labelledby=""heading${dateNum}" data-parent="#accordionHome">
    <div class="card-body">  
    ${divAccordionLinks.join('')}
    </div>
    </div>
  </div>
    `
    cardsArray.push(divAccordCards);
  }

  let homeInnerHTMLGen = `<div class="row d-flex justify-content-center">
  
  <div class="col-12 col-md-10 col-lg-8 col-xl-6">
  <div class="accordion" id="accordionHome">${cardsArray.join('')}</div></div>  
  </div>
  <div class="row d-flex justify-content-center"><div class="col-12 col-md-10 col-lg-8 col-xl-6"><canvas id="myChart"></canvas></div></div>
  `

  return `
  <div class="container-fluid">${homeInnerHTMLGen}</div>
  `;
}

let generateInnerHTMLForUrls = (resData) => {
  let urlListArray = [];

  for (let url of resData) {
    let divEle = `
    <div class="card">
      <div class="card-body">
      <div class="row d-flex justify-content-around">
      <span class="col-12 col-md-12 col-lg-2">${url.urlId}</span>
      <span class="col-12 col-md-12 col-lg-3"><a href="${url.url}" target="_blank">${url.shortUrl}</a></span>
      <span class="col-12 col-md-12 col-lg-3" style="word-wrap: break-word;">${url.url}</span>
      <span class="col-12 col-md-12 col-lg-2">${new Date(url.createdAt).toLocaleDateString('en-IN')}</span>
      <span class="col-12 col-md-12 col-lg-2 btn btn-danger delete-url-button" id="DELURL_${url.urlId}" >Delete</span>
    </div >
      </div >
    </div >
  `
    listOfURLID.push(`DELURL_${url.urlId}`);
    urlListArray.push(divEle);
  }
  let urlsInnerHTMLGen = `<div class="container-fluid" >
  <div class="card">
    <div class="card-body">
      <div class="row d-flex">
        <span class="col-12 col-md-12 col-lg-2 text-center" ><h3 class="btn btn-primary btn-block disabled" style="margin:1px;">ID</h3></span>
        <span class="col-12 col-md-12 col-lg-3 text-center" ><h3 class="btn btn-primary btn-block disabled" style="margin:1px;">Short Uri</h3></span>
        <span class="col-12 col-md-12 col-lg-3 text-center" ><h3 class="btn btn-primary btn-block disabled" style="margin:1px;">Url</h3></span>
        <span class="col-12 col-md-12 col-lg-2 text-center" ><h3 class="btn btn-primary btn-block disabled" style="margin:1px;">Date</h3></span>
        <span class="col-12 col-md-12 col-lg-2 text-center" ><h3 class="btn btn-primary btn-block disabled" style="margin:1px;">Delete</h3></span>
      </div>
    </div>
  </div>
${urlListArray.join('')}</div > `
  return urlsInnerHTMLGen;
}


let getListOfURLsPerDay = () => {
  loaderWithin('home-tab');
  const homeTabEle = document.getElementById('home-tab');
  if (!checkIfSignedIn()) {
    autoSignIn();
    return;
  }
  let email = localStorage.getItem('email');
  let token = localStorage.getItem('token');

  try {

    (async () => {
      try {
        const response = await fetch(`${serverBaseURL}/url/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token} `,
            'redirect': 'follow'
          }
        });
        const data = await response.json();
        if (data.length == 0) {
          homeTabEle.innerHTML = `Uri list empty add Uris to view`;
        } else {
          homeTabEle.innerHTML = generateInnerHTMLForHome(data);
          setTimeout(() => {
            generateChartForDashboard(data);
          }, 500);
        }


      } catch (err) {
        if (err.error) {
          // alert(err.error);
          sweetAlertShowCustom('Error!', err.error, 'error');
          location.reload();
          return;
        }
        // alert(err)
        sweetAlertShowCustom('Error!', error, 'error');
        location.reload();
        return;
      }
    })();

  } catch (error) {
    sweetAlertShowCustom('Error!', error, 'error');
    // alert(error);
  }

}

let getUrlList = () => {
  loaderWithin('urls-tab');
  const urlsTabEle = document.getElementById('urls-tab');
  if (!checkIfSignedIn()) {
    autoSignIn();
    return;
  }
  let email = localStorage.getItem('email');
  let token = localStorage.getItem('token');

  try {

    (async () => {
      try {
        const response = await fetch(`${serverBaseURL}/urls`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
            'redirect': 'follow'
          }
        });
        const data = await response.json();
        if (data.length == 0) {
          urlsTabEle.innerHTML = `Uri list empty add Uris to view`;
        } else {
          urlsTabEle.innerHTML = generateInnerHTMLForUrls(data);
        }
        listOfURLID.forEach((ele) => {
          let currentDelElement = document.getElementById(ele);

          currentDelElement.addEventListener('click', () => {

            deleteURI(ele);
          })
        })
      } catch (err) {
        if (err.error) {
          // alert(err.error);
          sweetAlertShowCustom('Error!', err.error, 'error');
          location.reload();
          return;
        }
        // alert(err)
        sweetAlertShowCustom('Error!', err, 'error');
        location.reload();
        return;
      }
    })();

  } catch (error) {
    sweetAlertShowCustom('Error!', error, 'error');
    // alert(error);
  }

}

let createUriApi = (urlValue) => {
  loaderWithin('create-url-tab');
  (async () => {
    try {
      const response = await fetch(`${serverBaseURL}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
          'redirect': 'follow'
        },
        body: JSON.stringify({
          "url": urlValue
        })
      });
      const data = await response.json();
      if (data) {
        // alert('Short Uri Created Successfully')
        sweetAlertShowCustom('Success!', 'Short Uri Created Successfully', 'success');
        setTimeout(() => {
          navigateToDashboard();
        }, 500);
      } else {
        throw data;
      }
      return;

    } catch (err) {
      if (err.error) {
        // alert(err.error);
        sweetAlertShowCustom('Error!', err.error, 'error');
        location.reload();
        return;
      }
      // alert(err)
      sweetAlertShowCustom('Error!', err, 'error');
      location.reload();
      return;
    }
  })();
}

let createFormRender = () => {
  loaderWithin('create-url-tab');
  let formInnerHTML = `
  <div class="container-fluid">
  <div class="jumbotron">
  <h3 class="display-4">Hello, Welcome to uriShorty!</h3>
  <p class="lead">Here you can Create Short Urls limitless!</p>
  <hr class="my-4">
  <p>Enter your very long stretchy url into the input below and get yourself a short url</p>  
</div>
  <div class="row d-flex justify-content-center">
    <div class="col-12 col-lg-6">
        <form id="createUrl">
        <div class="form-row d-flex justify-content-center">
        <div class="col-8 d-flex align-items-center">
        <label for="url-create">Uri</label>
        <input type="text" class="form-control ml-3" id="url-create" name="url" required>
        </div>  
        <div class="col-4 d-flex align-items-center">
        <button type="submit" class="btn btn-primary btn-lg">Create</button>
        </div>      
        </div>
        </form>
    </div>
  </div>
</div>
  `
  const createURLElement = document.getElementById('create-url-tab');
  createURLElement.innerHTML = formInnerHTML;

  const createFormElement = document.getElementById('createUrl');
  createFormElement.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log('createFormIsWorking');
    const urlValue = document.getElementById('url-create').value;
    if (!urlValue) {
      // alert('Url Value cannot be empty');
      sweetAlertShowCustom('Error!', 'Url Value cannot be empty', 'error');
      return;
    }
    createUriApi(urlValue);

  })

}


let renderHome = (email) => {
  let homeInnerHTML = `
  <div class ="row">    
  <div class="col-12 d-flex justify-content-between mt-3" style="height:5vh;">
      <p>${email}</p>
      <button class="btn btn-danger" id="signOutButton">Sign Out</button>
  </div>
  </div>
  <div class ="row">    
  <div class="col-12 mt-3" id="home-tab">

  </div>
  </div>
  `;

  const homeElement = document.getElementById('nav-home');
  homeElement.innerHTML = homeInnerHTML;
  const signOutButton = document.getElementById('signOutButton');
  signOutButton.addEventListener('click', () => {
    signOut();
  });

  getListOfURLsPerDay();
}


let renderUrls = () => {
  let urlsInnerHTML = `
  <div class ="row">    
  <div class="col-12 mt-3" id="urls-tab">

  </div>
  </div>
  `;
  const urlElement = document.getElementById('nav-urls');
  urlElement.innerHTML = urlsInnerHTML;
  getUrlList();
  const deleteURIButton = document.getElementsByClassName('delete-url-button');
};

let renderCreateURL = () => {
  let createURLInnerHTML = `
  <div class ="row">    
  <div class="col-12 mt-3" id="create-url-tab">
   
  </div>
  </div>
  `;
  const createURLElement = document.getElementById('nav-create');
  createURLElement.innerHTML = createURLInnerHTML;
  createFormRender();

};



let navigateToDashboard = (email = localStorage.getItem('email'), token = localStorage.getItem('token')) => {
  loader();
  if (checkIfSignedIn()) {
    let dashboardPageInnerHTML = `
    <div class="container-fluid">
      <h2 class="text-center mt-2 mb-1">Welcome to uriShorty!</h2>
      <div class ="row">    
        <div class="col-12">
        <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <a class="nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Home</a>
          <a class="nav-link" id="nav-urls-tab" data-toggle="tab" href="#nav-urls" role="tab" aria-controls="nav-urls" aria-selected="false">Urls</a>
          <a class="nav-link" id="nav-create-tab" data-toggle="tab" href="#nav-create" role="tab" aria-controls="nav-create" aria-selected="false">Create</a>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">...</div>
        <div class="tab-pane fade" id="nav-urls" role="tabpanel" aria-labelledby="nav-urls-tab">...</div>
        <div class="tab-pane fade" id="nav-create" role="tabpanel" aria-labelledby="nav-create-tab">...</div>
      </div>
        </div>
      </div>
    </div>
      
      `;
    console.log(email, JSON.stringify(token));
    mainElement.innerHTML = dashboardPageInnerHTML;

    setTimeout(() => {
      renderHome(email);
      renderUrls();
      renderCreateURL();
    })

  } else {
    sweetAlertShowCustom('Error! Not Signed in', 'Token missing', 'error');
    navigateToinitialPage();
  }

};

let signin = (signinEmail, password) => {
  loader();

  (async () => {
    try {
      const response = await fetch(`${serverBaseURL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": signinEmail,
          "password": password
        })
      });
      const data = await response.json();
      if (data.token) {

        localStorage.setItem('token', data.token);
        localStorage.setItem('email', signinEmail);
        token = data.token;
        email = signinEmail;
        setTimeout(() => {
          navigateToDashboard();
        }, 500);
      } else {
        throw data;
      }
      return;

    } catch (err) {
      if (err.error) {
        // alert(err.error);
        sweetAlertShowCustom('Error! Sign in', err.error, 'error');
        setTimeout(() => {
          location.reload();
        }, 2000);
        return;
      }
      // alert(err)
      sweetAlertShowCustom('Error! Sign in', err, 'error');
      setTimeout(() => {
        location.reload();
      }, 2000);
      return;
    }
  })();
};

let resetPassword = (email) => {
  loader();
  (async () => {
    try {
      const response = await fetch(`${serverBaseURL}/forgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": email
        })
      });
      const data = await response.json();

      if (response.status == 200) {
        // alert(data.message);
        sweetAlertShowCustom('Success! Reset Password', data.message, 'success');
        setTimeout(() => {
          navigateToinitialPage();
        }, 500);
      } else {
        throw data;
      }
      return;

    } catch (err) {
      if (err.error) {
        // alert(err.error);
        sweetAlertShowCustom('Error! Reset', err.error, 'error');
        location.reload();
        return;
      }
      // alert(err)
      sweetAlertShowCustom('Error! Reset', err, 'error');
      location.reload();
      return;
    }
  })();
};


let signup = (email, password) => {
  loader();

  (async () => {
    try {
      const response = await fetch(`${serverBaseURL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": email,
          "password": password
        })
      });
      const data = await response.json();
      if (data.token) {
        // alert('You Have Successfully Signed Up! Please Check your email for verification link');
        sweetAlertShowCustom('Success! Signup', 'You Have Successfully Signed Up! Please Check your email for verification link', 'success');
        setTimeout(() => {
          navigateToinitialPage();
        }, 500);
      } else {
        throw data;
      }
      return;

    } catch (err) {
      if (err.error) {
        // alert(err.error);
        sweetAlertShowCustom('Error! Signup', err.error, 'error');
        location.reload();
        return;
      }
      // alert(err)
      sweetAlertShowCustom('Error! Signup', err, 'error');
      location.reload();
      return;
    }
  })();
};


let navigateToSignup = () => {
  loader();
  setTimeout(() => {
    let signupInnerHTML = `
    <div class="row" style="margin:0;height:100vh;">
    <div class="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4 d-flex align-items-center justify-content-center">
    <div class="card">
    <div class="card-header">
      urlShorty
    </div>
    <div class="card-body">
      <h5 class="card-title">Sign Up!</h5>
      <a style="cursor:pointer" onclick="navigateToinitialPage();" class="card-text">Already have an account? click here to go sign in</a>
      <form id="signupForm">
      <div class="form-group">
        <label for="semail">Email address</label>
        <input type="email" class="form-control" id="semail" name="email" aria-describedby="semailHelp" required>
        <small id="semailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group">
        <label for="spassword">Password</label>
        <input type="password" class="form-control" id="spassword" pattern="^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$" name="password" required>
      </div>      
      <div class="form-group">
        <label for="scpassword">Confrim Password</label>
        <input type="password" class="form-control" id="scpassword" pattern="^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$" name="cpassword" required>
      </div>      
      <button type="submit" class="btn btn-primary">Sign Up</button>
    </form>  
    <p>
      <ul>
        <li>The string must contain at least 1 lowercase alphabetical character</li>
        <li>The string must contain at least 1 uppercase alphabetical character</li>
        <li>The string must contain at least 1 numeric character</li>
        <li>The string must contain at least one special character</li>
        <li>The string must be eight characters or longer</li>        
      </ul>
    </p>
    </div>
  </div>
    </div>
    </div>
    `;

    mainElement.innerHTML = signupInnerHTML;
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById('semail').value;
      const password = document.getElementById('spassword').value;
      const cpassword = document.getElementById('scpassword').value;

      if (password != cpassword) {
        // alert('Passwords Mismatch!');
        sweetAlertShowCustom('Error!', 'Passwords Mismatch!', 'warning');
        return;
      }
      signup(email, password);
    })

  }, 500);

}

let navigateToForgotPassword = () => {
  loader();
  setTimeout(() => {
    let resetPageInnerHTML = `
    <div class="row" style="margin:0;height:100vh;">
    <div class="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4 d-flex align-items-center justify-content-center">
    <div class="card">
    <div class="card-header">
      urlShorty
    </div>
    <div class="card-body">
      <h5 class="card-title">Reset Password</h5>      
      <form id="resetPasswordForm">
      <div class="form-group">
        <label for="rsemail">Email address</label>
        <input type="email" class="form-control" id="rsemail" name="email" aria-describedby="rsemailHelp" required>
        <small id="rsemailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>      
      <button type="submit" class="btn btn-primary">Reset</button>
    </form>  
    <a style="cursor:pointer" onclick="navigateToinitialPage();"><small>Get back to Signin</small></a>
    </div>
  </div>
    </div>
    </div>
    `;

    mainElement.innerHTML = resetPageInnerHTML;
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    resetPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById('rsemail').value;
      resetPassword(email);
    })
  }, 500)
}


let navigateToinitialPage = () => {
  loader();
  setTimeout(() => {
    let landingPageInnerHTML = `
    <div class="row" style="margin:0;height:100vh;">
    <div class="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4 d-flex align-items-center justify-content-center">
    <div class="card">
    <div class="card-header">
      urlShorty
    </div>
    <div class="card-body">
      <h5 class="card-title">Sign in</h5>
      <a style="cursor:pointer" onclick="navigateToSignup();" class="card-text">Don't have an account? click here to sign up</a>
      <form id="signinForm">
      <div class="form-group">
        <label for="email">Email address</label>
        <input type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" required>
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" minlength="8" name="password" required>
      </div>      
      <button type="submit" class="btn btn-primary">Sign in</button>
    </form>  
    <a style="cursor:pointer" onclick="navigateToForgotPassword();"><small>Forgot Password? Click here to Reset</small></a>
    </div>
  </div>
    </div>
    </div>
    `;

    mainElement.innerHTML = landingPageInnerHTML;
    const signInForm = document.getElementById('signinForm');
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      signin(email, password);

    })
  }, 500)

}


autoSignIn();

