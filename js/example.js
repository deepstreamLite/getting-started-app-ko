const koTools = new KoTools( ko );

class ViewModel{
	constructor( dsUrl ) {
		this.ds = deepstream( dsUrl );

		// Bind ConnectionState directly to observable
		this.connectionState = ko.observable();
		this.ds.on( 'connectionStateChanged', this.connectionState.bind( this ) );

		// Login without providing credentials
		this.ds.login();

		// Set up two-way bindings to the record
		this.record = this.ds.record.getRecord( 'test/johndoe' );
		this.firstname = koTools.getObservable( this.record, 'firstname' );
		this.lastname = koTools.getObservable( this.record, 'lastname' );

		// Send and receive publish-subscribe messages
		this.eventData = ko.observable();
		this.receivedEvents = ko.observableArray();
		this.ds.event.subscribe( 'test-event', this._onEvent.bind( this ) );
	}

	sendEvent() {
		this.ds.event.emit( 'test-event', this.eventData() );
	}

	_onEvent( data ) {
		this.receivedEvents.push( data );
	}
}

ko.applyBindings(new ViewModel(
	'wss://154.deepstreamhub.com?apiKey=97a397bd-ccd2-498f-a520-aacc9f67373c'
));