export type Product = {
	[key: string]: Product | Product[] | string | number | boolean | null;
};

export type FetchProductsResult = {
	total: number; // number of returned products for specified filter
	count: number; // number of returned products in the response
	products: Product[] // dummy JSON response since data structure were not specified
};

type FetchRequestOpts = {
	url: string;
	minPrice: number;
	maxPrice: number;
	retries?: number;
	maxIterations?: number;
};

export type FetchOpts = FetchRequestOpts & {
	url?: string;
};

const getRequest = async <T>(url: string, params: Record<string, string>): Promise<T> => {
	const response = await fetch(`${url}?${new URLSearchParams(params).toString()}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});

	const data = await response.json();
	return data as T;
};

const fetchProductsBatch = async (
	options: FetchRequestOpts
): Promise<FetchProductsResult> => {
	const attempts = options.retries || 3;
	let response: FetchProductsResult | null = null;

	for (let i = 0; i < attempts; i++) {
		try {
			response = await getRequest<FetchProductsResult>(options.url, {
				minPrice: options.minPrice.toString(),
				maxPrice: options.maxPrice.toString()
			});
			break;
		} catch (error) {
			console.error(error);
			if (i === (attempts - 1)) {
				console.error(`Failed to fetch product in price range ${options.minPrice}-${options.maxPrice}! Aborting...`);
				throw error;
			}
			await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
		}
	}

	if (response) {
		return response as FetchProductsResult;
	} else {
		throw new Error('Invalid server response');
	}
};

const roundToTwoDecimals = (value: number): number => {
	return Math.floor(value * 100) / 100;
};

/**
 * # fetchProducts
 * returns list of all products fetched from the provided API endpoint
 */
export const fetchProducts = async (options: FetchOpts): Promise<Product[]> => {
	if (!options.url) {
		options.url = 'https://api.ecommerce.com/products';
	}

	const steps = [1000, 500, 250, 100, 10, 1, 0.1, 0.01];
	const items: Product[] = [];

	const apiLimit = 1000;
	let lastMaxPrice = 0;
	let countFetched = 0;

	const getAll = await fetchProductsBatch(options);
	const countTotal = getAll.total;

	if (getAll.total <= apiLimit) {
		return getAll.products || [];
	}

	let iLoopLimit = 1;

	for (let i = 0; i < iLoopLimit; i++) {
		if (options.maxIterations && i >= options.maxIterations) {
			throw new Error(`Reached the iteration limit ${options.maxIterations} while fetching products`);
		}

		innerLoop: for (let j = 0, stepsLength = steps.length; j < stepsLength; j++) {
			const loopMinPrice = roundToTwoDecimals((i === 0) ? lastMaxPrice : (lastMaxPrice + 0.01));
			const loopMaxPrice = roundToTwoDecimals(Math.min((lastMaxPrice + steps[j]), options.maxPrice));

			const response = await fetchProductsBatch({
				url: options.url,
				minPrice: loopMinPrice,
				maxPrice: loopMaxPrice,
			});

			if (response.total <= apiLimit) {
				items.push(...response.products);
				countFetched += response.total;
				lastMaxPrice = loopMaxPrice;
				break innerLoop;
			} else if (j === (stepsLength - 1)) {
				const message = `more than ${apiLimit} products in smallest possible range ${loopMinPrice}-${loopMaxPrice}`;
				console.error(message);
				throw new Error(message);
			}
		}

		if (countFetched < countTotal) {
			iLoopLimit++;
		} else {
			break;
		}
	}

	return items;
};
