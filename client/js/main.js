Ractive.components.Message = Ractive.extend({
    template: '#message',
    oninit: function () {
        const self = this;
        self.on('buttonClick', function (ev) {
            const event_id = self.get('data.event_id');
            $.ajax({
                url: `http://${location.hostname}:8080/sayHello/${event_id}`,
                data: JSON.stringify({
                    someData: 1
                }),
                contentType: 'application/json',
                method: 'POST'
            }).then(() => {
                //Do something
            });
        });
    }
});

const r = new Ractive({
    el: '#frame',
    template: '#home',
    data: {},
    oninit: function () {
        const self = this;
        const roomKey = location.href.split('?')[0].split('/').slice(-1)[0];
        fetch(`http://${location.hostname}:8080/getMessages/${roomKey}`)
            .then(res => res.json())
            .then(data => self.set('messages', data));
    }
});