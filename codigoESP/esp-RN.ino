#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "Ilgner";
const char* password = "0123456789";

const int ledPin = 23; // Pino onde o LED está conectado
bool ledState = false; 
WebServer server(80);



void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(36,INPUT);
  digitalWrite(ledPin, LOW); // LED começa desligado

  // Conexão Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  Serial.println("Conectado ao WiFi!");
  Serial.println(WiFi.localIP()); 

   server.on("/led", handleLED); // Define rota para controlar o LED
   server.on("/analog", handleAnalog); 
  server.begin(); // Inicia o servidor

}

void loop() {
  // put your main code here, to run repeatedly:
  server.handleClient();
}


void handleLED(){

if(server.method()== HTTP_POST){
  String state = server.arg("state"); // pega o valor do parametro state

    if (state == "on") {
      digitalWrite(ledPin, HIGH);
      ledState = true;
    } else if (state == "off") {
      digitalWrite(ledPin, LOW);
      ledState = false;
    }
     server.send(200, "text/plain", ledState ? "LED is ON" : "LED is OFF");
}else{
  server.send(405, "text/plain", "Method Not Allowed");
}

}

void handleAnalog (){
int analogValue = analogRead(36);
String response = String(analogValue);
server.send(200, "text/plain", response);
}
