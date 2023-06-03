#include <Servo.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ThingSpeak.h>


// ThingSpeak variables
String apiKey = "ZKXYM7NIKA9U1UUB";
const char* ssid = "";
const char* pass = "";
const char* server = "api.thingspeak.com";


// Servo variables
const int relayPin =D2; // the digital pin connected to the relay module
const int ledPin = D1; // the digital pin connected to the LED
const int servo_pin1 =D8;

Servo servo;                // Create a servo object
  

// Ultrasonic sensor variables
const int trigPin1 = D4;
const int echoPin1 = D5;
const int trigPin2 = D6;
const int echoPin2 = D7;
long duration, distance, st1, st2, cntr = 0,pos=0;
WiFiClient client;

void setup() {
  // Servo setup
  
  pinMode(ledPin, OUTPUT); // set the LED pin as an output
  Serial.begin(9600); // Starts the serial communication 
  pinMode(relayPin, OUTPUT); // set the relay pin as an output
  servo.attach(servo_pin1); // Set up the servo
  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);
  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);

  // ThingSpeak setup
  Serial.println("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println(".................");      
}

void loop() {  
  // Ultrasonic sensor readings
  SonarSensor(trigPin1, echoPin1);
  st1 = distance;
  SonarSensor(trigPin2, echoPin2);
  st2 = distance;

    // pump control based on sensor readings
  if (st2 >= 5 && st2 <= 10) {
   digitalWrite(relayPin, LOW); // turn the relay ON
  
  }
    else if ( st2 > 10) {
    digitalWrite(ledPin, LOW); // turn the LED ON
    servo.write(180); // set the servo position to 180 degrees
    digitalWrite(relayPin, LOW);// turn the relay ON
 
     }
     else{
      digitalWrite(ledPin, HIGH); // turn the LED OFF
      digitalWrite(relayPin, HIGH); // turn the relay OFF
      servo.write(0); // set the servo position to 0 degrees
      }
  
  

  cntr++;
  delay(1000);
  
  // Send data to ThingSpeak every 10 readings
  if (cntr >= 1) {
    if (client.connect(server, 80)) { //  api.thingspeak.com
      String postStr = apiKey;
      postStr += "&field1=";
      postStr += String(st1);
      postStr += "\r\n\r\n"; 
      postStr += "&field2=";
      postStr += String(st2);
      postStr += "\r\n\r\n";
      postStr +="&field3=";
      postStr += String(st1);          
      postStr += "\r\n\r\n";
      client.print("POST /update HTTP/1.1\n");
      client.print("Host: api.thingspeak.com\n");
      client.print("Connection: close\n");
      client.print("X-THINGSPEAKAPIKEY: " + apiKey + "\n");
      client.print("Content-Type: application/x-www-form-urlencoded\n");
      client.print("Content-Length: ");
      client.print(postStr.length());
      client.print("\n\n");
      client.print(postStr);
    }               
    client.stop();
    delay(1000);  
  }    
  
  // Print sensor readings to serial monitor
  Serial.print(" street1 =  ");        
  Serial.print(st1);
  Serial.println("cm"); 
  Serial.print(" street2 =  ");        
  Serial.print(st2);
  Serial.println("cm"); 
  Serial.println(".................");
  
  // Wait for a short period of time before reading the sensor again
  delay(1000);

}

// Function to read ultrasonic sensor
void SonarSensor(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance =22-(duration * 0.034 / 2);
  delay(5000);
  
  
}



