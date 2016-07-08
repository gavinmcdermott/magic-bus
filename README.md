# The MagicBus

### Overview
MagicBus is a thin layer that sits on top of IPFS with the aim of creating a ‘living network of meaning’. The MagicBus protocol allows nodes to quickly and easily subscribe to messages or data streams, compose and process that data, then publish a resulting data stream or message to any downstream subscribers.

### Software Sensors

A software sensor is a node in the MagicBus network that takes zero or more input streams and shares messages in an output stream. Software sensors have a unique identity based on public / private keypairs, and produce signed messages that can be verifiably traced to the emitting sensor. 

There are two types of software sensors: **Atomic** and **Composite**.

### Atomic Sensors

Atomic Sensors broadcast messages that contain a single, arbitrary data structure (as defined by the protocol). The data contained in Atomic Sensor messages has pointers to previous broadcasts (allowing for version histories), and are used in arbitrary compositions by network participants and consumers. 

Atomic Sensors may be a mix of hardware and software, or software only. We envision software sensors often running on embedded hardware and publishing messages based on sensor readings. 

**Hardware + software example:** A single sensor that consists of a physical water temperature sensor that is able to automatically broadcast a message with the current water temperature, to the MagicBus network, every minute. 

**Software-only example:** A research team at Stanford that, based on their latest findings, updates a value representing the volume of E. coli required to synthesize biofuel in a given aqueous environment. Whenever the value changes, a message containing the new value is automatically broadcast to the network.

### Composite Sensors

Composite Sensors broadcast messages that contain a single, arbitrary data structure whose end values were composed from messages from various, upstream Atomic and Composite Sensors in the MagicBus network. In this sense, Composite Sensors can be seen as generating higher-order data and messages. These higher-order messages can also be consumed by downstream network participants and consumers. 

In addition to output data, a composite sensor’s published message may also include hashes of the incoming messages used to generate the output, allowing subscribers to access the tree of intermediate messages that led to the publication of a given message all the way down to the originating Atomic Sensors.

Composite Sensors may also be a mix of hardware and software, or software only. 

**Hardware + software example:** A single sensor that reads data directly from several physical water temperature sensors, and also subscribes to several ‘Water Temperature Atomic Sensors’ in the MagicBus network. It then composes the various temperatures into a single average value and automatically broadcasts it to the network in a message. 

**Software-only example:** A single sensor that only subscribes to several ‘Water Temperature Atomic Sensors’ in the MagicBus network and composes the various temperatures into a single average value and automatically broadcasts to the network it in a message. 

### Goals and the Initial Scope

For *Creators* of Software Sensors:

* Make it easy to originate, remix, or modify both Atomic and Composite Sensors, then add them to the network.

* Create a simple protocol, along with any supporting ones, that can be easily implemented in multiple languages (e.g.: It will handle the heavier lifting of encoding / formatting / sending / receiving messages, automatic pub / sub to relevant data sources, etc.).

For *Consumers* of Software Sensors:

* Provide a simple, powerful living demo that displays (through new hypermedia tools) the true potential of working with *living data* from the MagicBus network (e.g.: New consumption and composition demo tools that show what it is like to read and write living data).

### Goals Beyond the Initial Scope

These are known areas we need to solve for at some point. We believe numerous possible solutions will arise in the creation and exploration of the network outlined above. We will develop these as they become clear.

* Provide an intuitive mechanism for discovering live, relevant software sensors to be used for consumption, composition, and remixing.
