const send_btn = document.getElementById("send_btn");
const geo_btn = document.getElementById("geo_btn");
const clean_chat_btn = document.getElementById("clean_chat_btn");
const chat_box = document.getElementById("chat_box");

let echo_server;

function get_input_value() {
  let input_value = document.getElementById('input_field').value;
};

function write_to_chat_box(message) {
  let post = document.createElement("div");
  // post.style.wordWrap = "break-word";
  post.innerHTML = message;
  chat_box.appendChild(post);
};

function echo_server_connect() {
  return new Promise((resolve, reject) => {
    let server = new WebSocket('wss://echo-ws-service.herokuapp.com');
    server.onopen = () => {
      write_to_chat_box('<p style="color: #ff4f00;">УСТАНОВЛЕНО СОЕДИНЕНИЕ С ЭХО-СЕРВЕРОМ<\p>');
      resolve(server);
    };
    server.onerror = (err) => {
      write_to_chat_box('<p style="color: #ff4f00;">ОШИБКА СОЕДИНЕНИЯ С ЭХО-СЕРВЕРОМ<\p>');
      reject(err)
    };
  });
};

const success_geo_check = (position) => {
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  echo_server.send(`${latitude}, ${longitude}`);
  echo_server.onmessage = null;
  write_to_chat_box(`<p style="color: #000080;">Геолокация: <a href=https://www.openstreetmap.org/#map=18/${latitude}/${longitude}>ссылка на ваше местоположение</a></p>`)
};

const geo_check_error = () => {
  write_to_chat_box('<p style="color: #000080;">Геолокация: ошибка при получении вашего местоположения</p>')
}

function geolocation() {
  // return new Promise(() => {
    if (!navigator.geolocation) {
      write_to_chat_box(`<p style="color: #ff4f00;">ГЕОЛОКАЦИЯ НЕ ПОДДЕРЖИВАЕТСЯ ВАШИМ БРАУЗЕРОМ`);
      // resolve('Не поддерживается')
      } else {
        navigator.geolocation.getCurrentPosition(success_geo_check, geo_check_error);
      // reject('Поддерживается') 
    } 
  };
// }

send_btn.addEventListener('click', async () => {
  if (!echo_server) {
    chat_box.innerHTML = null;
    echo_server = await echo_server_connect();
  };
  if (document.getElementById('input_field').value) {
    let input_value = document.getElementById('input_field').value;
    write_to_chat_box(`<p style="color: #008000; text-align: right;">Вы: ${input_value}</p>`);
    echo_server.send(input_value);
    echo_server.onmessage = function(evt) {
      write_to_chat_box(`<p style="color: #800080;">Эхо-сервер: ${evt.data}</p>`);
    document.getElementById('input_field').value = null;
    };
  };
});

clean_chat_btn.addEventListener('click', () => {
  chat_box.innerHTML = null;
  echo_server.close();
  echo_server.onclose = function() {
    write_to_chat_box('<p style="color: #ff4f00;">СОЕДИНЕНИЕ С ЭХО-СЕРВЕРОМ ЗАВЕРШЕНО</p>');
  };
  echo_server = null;
});

geo_btn.addEventListener('click', async () => {
  if (!echo_server) {
    chat_box.innerHTML = null;
    echo_server = await echo_server_connect();
  };
  geolocation();
});
