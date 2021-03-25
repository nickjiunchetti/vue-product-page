var eventBus = new Vue()

Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `
		<div class="row">
			<div>
				<img v-bind:src="image">
				<product-tabs :reviews="reviews"></product-tabs>
			</div>

			<div>
				<h1>{{title}}</h1>
				<p v-if="inStock">In Stock</p>
				<p v-else>Out of Stock</p>
				<ul>
					<li v-for="detail in details">{{detail}}</li>
				</ul>
	
				<div 
					v-for="(variant, index) in variants" 
					:key="variant.variantId"
					class="color-box"
					:style="{backgroundColor: variant.variantColor}"
					@mouseover="updateProduct(index)">
				</div>
	

	

				<p>Shipping: {{shipping}}</p>

				<div class="row">
					<button 
						v-on:click="addVariantToCart" 
						:disabled="!inStock"
						:class="{disabledButton: !inStock}">
						Add to Cart
					</button>
					<button v-on:click="removeVariantFromCart">Remove from Cart</button>
				</div>
			</div>



		</div>
	`,
	data() {
		return {
			brand: 'Vue Master',
			product: 'Socks',
			selectedVariant: 0,
			details: ["80% cotton", "20% polyester", "Gender Neutral"],
			reviews: [],
			variants: [
				{
					variantId: 2234,
					variantColor: "green",
					variantImage: './assets/green-sock.jpg',
					variantQuantity: 10
				},
				{

					variantId: 2235,
					variantColor: "blue",
					variantImage: './assets/blue-sock.jpg',
					variantQuantity: 0
				}
			]
		}
	},
	methods: {
		addVariantToCart() {
			this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
		},
		removeVariantFromCart() {
			this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
		},
		updateProduct(index) {
			this.selectedVariant = index
		}
	},
	computed: {
		title() {
			return this.brand + ' ' + this.product
		},
		image() {
			return this.variants[this.selectedVariant].variantImage
		},
		inStock() {
			return this.variants[this.selectedVariant].variantQuantity
		},
		shipping() {
			if (this.premium) {
				return "Free"
			} else return 10.99
		},
		mounted() {
			eventBus.$on('review-submitted', productReview => {
				console.log(productReview)
				this.reviews.push(productReview)
			})
		}
	}
})

Vue.component('product-review', {
	template: `
		<form class="review-form" @submit.prevent="onSubmit">

			<p v-if="errors.length">
				<b>Please correct the following error(s):</b>

				<ul>
					<li v-for="error in errors"> 
						{{error}}
					</li>
				</ul>
			</p>

			<p>
				<label for="name">Name:</label>
				<input id="name" v-model="name">
			</p>

			<p>
				<label for="review">Review:</label>
				<textarea id="review" v-model="review"></textarea>
			</p>

			<p>
				<label for="rating">Rating:</label>
				<select id="rating" v-model.number="rating">
					<option>5</option>
					<option>4</option>
					<option>3</option>
					<option>2</option>
					<option>1</option>
				</select>
			</p>
			
			<p>
				<input type="submit" value="Submit">
			</p>
		</form>
	`,
	data() {
		return {
			name: null,
			review: null,
			rating: null,
			errors: []
		}
	},
	methods: {
		onSubmit() {
			this.errors = []
			if (this.name && this.review && this.rating) {
				let productReview = {
					name: this.name,
					review: this.review,
					rating: this.rating
				}
				eventBus.$emit('review-submitted', productReview)

				this.name = null
				this.review = null
				this.rating = null
			} else {
				if (!this.name) this.errors.push("Name Required.")
				if (!this.review) this.errors.push("Review Required.")
				if (!this.rating) this.errors.push("Rating Required.")
			}

		}
	}
})

Vue.component('product-tabs', {
	props: {
		reviews: {
			type: Array,
			required: true
		}
	},
	template: `
		<div class="tab-div">
			<span 
				class="tab"
				:class="{activeTab: selectedTab === tab}"
				v-for="(tab, index) in tabs" :key="index"
				@click="selectedTab = tab">
				{{tab}}
			</span>
			<div style="margin-left: 25px" v-show="selectedTab === 'Reviews'">
				<p v-if="!reviews.length">There are no reviews yet.</p>
				<ul  v-else>
					<li 
						v-for="(review, index) in reviews"
						:key="index">
						<div class="border">
							<p>{{review.name}}</p>
							<p>{{review.rating}}</p>
							<p>{{review.review}}</p>
						</div>
					</li>
				</ul>
			</div>
			<product-review  v-show="selectedTab === 'Make a Review'"></product-review>
		</div>
	`,
	data() {
		return {
			tabs: ['Reviews', 'Make a Review'],
			selectedTab: 'Reviews'
		}
	}
})

var app = new Vue({
	el: '#app',
	data: {
		premium: true,
		cart: []
	},
	methods: {
		addToCart(id) {
			this.cart.push(id)
		},
		removeFromCart(id) {
			let index = this.cart.indexOf(id)
			this.cart.splice(index, 1)
		},
	}
})