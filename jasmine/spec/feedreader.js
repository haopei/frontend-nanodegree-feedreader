/**
 * feedreader.js
 * This is the spec file that Jasmine will read and contains
 *   all of the tests that will be run against your application.
 */
$(function() {
    describe('RSS Feeds', function() {

        it('allFeeds is defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /**
         * Loops through each feed in the allFeeds object and
         *   ensures it has a URL defined and that the URL is not empty.
         */
        it('all URLs in allFeeds are defined, and not empty', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url).not.toBe('');
            });
        });

        /**
         * Loops through each feed in the allFeeds object and
         *   ensures it has a name defined and that the name is not empty.
         */
        it('all name in allFeeds are defined, and not empty', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name).not.toBe('');
            });
        });

    });

    /**
     * Ensures the menu element is hidden by default
     *   and toggles visibility when clicked.
     */
    describe('The menu', function() {
        var body = $('body'),
            menuIcon = $('a.menu-icon-link');


        it('hidden by default', function() {
            expect(body.hasClass('menu-hidden')).toBe(true);
        });

        /**
         * Ensures the menu changes visibility when the menu icon is clicked.
         * Menu displays on first click and hides on second click.
         */
        it("menu displays and then hides, on click", function() {
            // menu displays on first click
            menuIcon.trigger('click');
            expect(body.hasClass('menu-hidden')).not.toBe(true);

            // menu is hidden on second click
            menuIcon.trigger('click');
            expect(body.hasClass('menu-hidden')).toBe(true);
        });
    });

    /**
     * Ensures when the loadFeed function is called and completes its work,
     *   and there is at least a single .entry element
     *   within the .feed container.
     */
    describe("Initial Entries", function() {

        // runs once, before each it() runs
        beforeEach(function(done) {
            spyOn(window, 'loadFeed').and.callThrough();
            loadFeed(0, done); // is called and completes its work
        });

        it("loadFeed() is defined", function() {
            expect(loadFeed).toBeDefined();
        });

        it('loadFeed() is called', function() {
            expect(window.loadFeed).toHaveBeenCalled();
        });

        it('div.feed is exists', function() {
            // toExist() is a matcher from jasmine-jquery
            expect($('.feed')).toExist();
        });

        it('at least one .entry exists', function() {
            expect($('.entry').length === 0).not.toBe(true);
        });

    });

    /**
     * Ensures when a new feed is loaded
     *   by the loadFeed() that the content actually changes.
     */
    describe('New Feed Selection', function() {
        var firstFeed,
            secondFeed;

        beforeEach(function(done) {
            spyOn(window, 'loadFeed').and.callThrough();
            loadFeed(0, done); // load first feed (Udacity Blog)
        });

        it('loadFeed(0) had been called', function() {
            expect(window.loadFeed).toHaveBeenCalledWith(0, jasmine.any(Function));
            // saves this .feed's value within the 'this' object of this spec
            this.firstFeed = $('.feed').html();
            // save this within firstFeed (top-level var) so comparison spec can access it
            firstFeed = this.firstFeed;
        });

        describe('Load another feed', function() {
            beforeEach(function(done) {
                loadFeed(1, done); // load second feed (CSS Tricks)
            });

            it('loadFeed(1) had been called', function() {
                expect(window.loadFeed).toHaveBeenCalledWith(1, jasmine.any(Function));
                // saves this .feed's value within the 'this' object of this spec
                this.secondFeed = $('.feed').html();
                // save this within secondFeed (top-level var) so comparison spec can access it
                secondFeed = this.secondFeed;
            });

            // comparison spec: ensures different contents were loaded by loadFeed()
            it('firstFeed NOT equal to secondFeed', function() {
                expect(firstFeed).not.toEqual(secondFeed);
            });
        });
    });

    /**
     * Udacious Test Coverage Extras #1
     * Checks if feedList menu links are loaded
     *   and when any menu link is clicked, the menu hides.
     */
    describe('Udacious Extras #1: Menu extras', function() {
        var body = $('body'),
            menuIcon = $('a.menu-icon-link'),
            feedListLinkChildren = $('.feed-list').find('li a'),
            feedListLink = $('.feed-list').find('li a')[1];

        // Tests if feedList links are loaded.
        it('feedList menu links are loaded', function() {
            expect(feedListLinkChildren.length).not.toBe(0);
        });

        // tests if menu hides when menu links are clicked
        describe('Even more menu', function() {
            beforeEach(function(done) {
                $(menuIcon).trigger('click'); // opens menu
                $(feedListLink).trigger('click'); // clicks a feedList link
                done();
            });

            // reset menu to default after test
            afterEach(function() {
                $(body).addClass('menu-hidden');
            });

            it('menu hides when feedItem link is clicked', function() {
                expect(body.hasClass('menu-hidden')).toBe(true);
            });
        });
    });

    /**
     * Udacious Test Coverage Extras #2
     * Uses and.callFake() to emulate logged in user
     */
    describe('Udacious Extras #2: userSession', function() {
        // top-level scope variable to allow access in specs
        var userSession;

        // uses and.callFake() to emulate a logged-in user session
        beforeEach(function() {
            // all calls to this .callFake() chained spy will delegate to supplied function
            spyOn(window, 'loggedIn').and.callFake(function() {
                // return true emulates an active session.
                return true;
            });
            userSession = loggedIn(); // find loggedIn() inside app.js
        });

        it('user is logged in', function() {
            expect(userSession).toBe(true);
        });
    });

    /**
     * Documentation test
     *   tests the examples inside the jasmine documentation
     */
    describe('Documentation tests', function() {
        beforeEach(function() {
            this.greeting = 'hi there';
        });

        it('can access values inside the "this" object', function() {
            expect(this.greeting).toBe('hi there');
            this.greeting = 'I can see you';
            this.something = 'other it() cannot see me, but I can be seen inside afterEach()\'s this object';
        });

        it('cannot share "this" object between it() functions inside suite', function() {
            expect(this.something).toBe(undefined);
            console.log(this);
        });

        afterEach(function() {
            console.log(this);
            // >>> Object {greeting: "I can see you", something: "other it() cannot see me, but I can be seen inside afterEach()'s this object"}
        });

    });
}());