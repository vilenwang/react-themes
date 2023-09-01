const B2BToken = window.sessionStorage.getItem('b2bToken')

export const getproductCustomField = (data = {}) => {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "GET",
      url: "https://darwin-microflu.tech/api/v1/storefront/credit-notes",
      headers: {
        authToken: B2BToken,
      },
      dataType: "json",
      contentType: "application/json",
      data,
      success(res) {
        resolve(res)
      },
      error(error) {
        reject(error);
      },
    }); 
  });
};

export const applyCreditNote = (id,data) => {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      url: `https://darwin-microflu.tech/api/v1/storefront/credit-notes/${id}/apply`,
      headers: {
        authToken: B2BToken,
      },
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(data),
      success(res) {
        resolve(res)
      },
      error(error) {
        reject(error);
      },
    }); 
  });
};

export const getCreditNoteDetail = (id) => {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "GET",
      url: `https://darwin-microflu.tech/api/v1/storefront/credit-notes/${id}`,
      headers: {
        authToken: B2BToken,
      },
      dataType: "json",
      contentType: "application/json",
      success(res) {
        resolve(res)
      },
      error(error) {
        reject(error);
      },
    }); 
  });
};