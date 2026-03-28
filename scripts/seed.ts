/**
 * Seed script: populates companies + rating rows.
 * Run: npx ts-node --project tsconfig.seed.json scripts/seed.ts
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const INDUSTRY_SCOPES = ['in_industry', 'all']
const VOTER_LEVELS = ['student', 'entry', 'mid', 'senior', 'global']

interface Company {
  name: string
  domain: string
  industry: string
}

const companies: Company[] = [
  // Investment Banking
  { name: 'Goldman Sachs', domain: 'goldmansachs.com', industry: 'Investment Banking' },
  { name: 'Morgan Stanley', domain: 'morganstanley.com', industry: 'Investment Banking' },
  { name: 'JPMorgan', domain: 'jpmorgan.com', industry: 'Investment Banking' },
  { name: 'Bank of America', domain: 'bankofamerica.com', industry: 'Investment Banking' },
  { name: 'Lazard', domain: 'lazard.com', industry: 'Investment Banking' },
  { name: 'Evercore', domain: 'evercore.com', industry: 'Investment Banking' },
  { name: 'Centerview Partners', domain: 'centerviewpartners.com', industry: 'Investment Banking' },
  { name: 'PJT Partners', domain: 'pjtpartners.com', industry: 'Investment Banking' },
  { name: 'Moelis & Company', domain: 'moelis.com', industry: 'Investment Banking' },
  { name: 'Jefferies', domain: 'jefferies.com', industry: 'Investment Banking' },
  { name: 'Barclays', domain: 'barclays.com', industry: 'Investment Banking' },
  { name: 'Deutsche Bank', domain: 'db.com', industry: 'Investment Banking' },
  { name: 'Citi', domain: 'citi.com', industry: 'Investment Banking' },
  { name: 'UBS', domain: 'ubs.com', industry: 'Investment Banking' },
  { name: 'Rothschild & Co', domain: 'rothschildandco.com', industry: 'Investment Banking' },
  { name: 'Houlihan Lokey', domain: 'hl.com', industry: 'Investment Banking' },
  { name: 'William Blair', domain: 'williamblair.com', industry: 'Investment Banking' },
  { name: 'Piper Sandler', domain: 'pipersandler.com', industry: 'Investment Banking' },
  { name: 'RBC Capital Markets', domain: 'rbc.com', industry: 'Investment Banking' },
  { name: 'Wells Fargo', domain: 'wellsfargo.com', industry: 'Investment Banking' },

  // Management Consulting
  { name: 'McKinsey & Company', domain: 'mckinsey.com', industry: 'Management Consulting' },
  { name: 'Boston Consulting Group', domain: 'bcg.com', industry: 'Management Consulting' },
  { name: 'Bain & Company', domain: 'bain.com', industry: 'Management Consulting' },
  { name: 'Deloitte', domain: 'deloitte.com', industry: 'Management Consulting' },
  { name: 'PwC', domain: 'pwc.com', industry: 'Management Consulting' },
  { name: 'EY', domain: 'ey.com', industry: 'Management Consulting' },
  { name: 'KPMG', domain: 'kpmg.com', industry: 'Management Consulting' },
  { name: 'Oliver Wyman', domain: 'oliverwyman.com', industry: 'Management Consulting' },
  { name: 'Roland Berger', domain: 'rolandberger.com', industry: 'Management Consulting' },
  { name: 'A.T. Kearney', domain: 'kearney.com', industry: 'Management Consulting' },
  { name: 'Booz Allen Hamilton', domain: 'boozallen.com', industry: 'Management Consulting' },
  { name: 'L.E.K. Consulting', domain: 'lek.com', industry: 'Management Consulting' },
  { name: 'Strategy&', domain: 'strategyand.pwc.com', industry: 'Management Consulting' },
  { name: 'Accenture Strategy', domain: 'accenture.com', industry: 'Management Consulting' },
  { name: 'ZS Associates', domain: 'zs.com', industry: 'Management Consulting' },
  { name: 'Huron Consulting', domain: 'huronconsultinggroup.com', industry: 'Management Consulting' },
  { name: 'FTI Consulting', domain: 'fticonsulting.com', industry: 'Management Consulting' },
  { name: 'Gartner', domain: 'gartner.com', industry: 'Management Consulting' },
  { name: 'Analysis Group', domain: 'analysisgroup.com', industry: 'Management Consulting' },
  { name: 'Cornerstone Research', domain: 'cornerstone.com', industry: 'Management Consulting' },

  // Private Equity & Hedge Funds
  { name: 'Blackstone', domain: 'blackstone.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'KKR', domain: 'kkr.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Apollo Global', domain: 'apollo.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Carlyle Group', domain: 'carlyle.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'TPG', domain: 'tpg.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Warburg Pincus', domain: 'warburgpincus.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Advent International', domain: 'adventinternational.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Bain Capital', domain: 'baincapital.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'General Atlantic', domain: 'generalatlantic.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Silver Lake', domain: 'silverlake.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Vista Equity', domain: 'vistaequitypartners.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Thoma Bravo', domain: 'thomabravo.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Bridgewater Associates', domain: 'bridgewater.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Citadel', domain: 'citadel.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Two Sigma', domain: 'twosigma.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'DE Shaw', domain: 'deshaw.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Renaissance Technologies', domain: 'rentec.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Point72', domain: 'point72.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'Millennium Management', domain: 'mlp.com', industry: 'Private Equity & Hedge Funds' },
  { name: 'AQR Capital', domain: 'aqr.com', industry: 'Private Equity & Hedge Funds' },

  // Big Tech
  { name: 'Google', domain: 'google.com', industry: 'Big Tech' },
  { name: 'Meta', domain: 'meta.com', industry: 'Big Tech' },
  { name: 'Apple', domain: 'apple.com', industry: 'Big Tech' },
  { name: 'Microsoft', domain: 'microsoft.com', industry: 'Big Tech' },
  { name: 'Amazon', domain: 'amazon.com', industry: 'Big Tech' },
  { name: 'Netflix', domain: 'netflix.com', industry: 'Big Tech' },
  { name: 'Nvidia', domain: 'nvidia.com', industry: 'Big Tech' },
  { name: 'Salesforce', domain: 'salesforce.com', industry: 'Big Tech' },
  { name: 'Adobe', domain: 'adobe.com', industry: 'Big Tech' },
  { name: 'Palantir', domain: 'palantir.com', industry: 'Big Tech' },
  { name: 'Snowflake', domain: 'snowflake.com', industry: 'Big Tech' },
  { name: 'Uber', domain: 'uber.com', industry: 'Big Tech' },
  { name: 'Airbnb', domain: 'airbnb.com', industry: 'Big Tech' },
  { name: 'Stripe', domain: 'stripe.com', industry: 'Big Tech' },
  { name: 'SpaceX', domain: 'spacex.com', industry: 'Big Tech' },
  { name: 'OpenAI', domain: 'openai.com', industry: 'Big Tech' },
  { name: 'Anthropic', domain: 'anthropic.com', industry: 'Big Tech' },
  { name: 'Databricks', domain: 'databricks.com', industry: 'Big Tech' },
  { name: 'Figma', domain: 'figma.com', industry: 'Big Tech' },
  { name: 'Notion', domain: 'notion.so', industry: 'Big Tech' },

  // Accounting
  { name: 'Deloitte', domain: 'deloitte.com', industry: 'Accounting' },
  { name: 'PwC', domain: 'pwc.com', industry: 'Accounting' },
  { name: 'EY', domain: 'ey.com', industry: 'Accounting' },
  { name: 'KPMG', domain: 'kpmg.com', industry: 'Accounting' },
  { name: 'Grant Thornton', domain: 'grantthornton.com', industry: 'Accounting' },
  { name: 'RSM', domain: 'rsmus.com', industry: 'Accounting' },
  { name: 'BDO', domain: 'bdo.com', industry: 'Accounting' },
  { name: 'Moss Adams', domain: 'mossadams.com', industry: 'Accounting' },
  { name: 'CohnReznick', domain: 'cohnreznick.com', industry: 'Accounting' },
  { name: 'Marcum', domain: 'marcumllp.com', industry: 'Accounting' },
  { name: 'Crowe', domain: 'crowe.com', industry: 'Accounting' },
  { name: 'Baker Tilly', domain: 'bakertilly.com', industry: 'Accounting' },
  { name: 'Plante Moran', domain: 'plantemoran.com', industry: 'Accounting' },
  { name: 'Dixon Hughes Goodman', domain: 'dhg.com', industry: 'Accounting' },
  { name: 'Forvis Mazars', domain: 'forvismazars.com', industry: 'Accounting' },

  // Law
  { name: 'Kirkland & Ellis', domain: 'kirkland.com', industry: 'Law' },
  { name: 'Latham & Watkins', domain: 'lw.com', industry: 'Law' },
  { name: 'Skadden', domain: 'skadden.com', industry: 'Law' },
  { name: 'Sullivan & Cromwell', domain: 'sullcrom.com', industry: 'Law' },
  { name: 'Wachtell Lipton', domain: 'wlrk.com', industry: 'Law' },
  { name: 'Cravath', domain: 'cravath.com', industry: 'Law' },
  { name: 'Paul Weiss', domain: 'paulweiss.com', industry: 'Law' },
  { name: 'Simpson Thacher', domain: 'stblaw.com', industry: 'Law' },
  { name: 'Davis Polk', domain: 'davispolk.com', industry: 'Law' },
  { name: 'Cleary Gottlieb', domain: 'clearygottlieb.com', industry: 'Law' },
  { name: 'Weil Gotshal', domain: 'weil.com', industry: 'Law' },
  { name: 'Sidley Austin', domain: 'sidley.com', industry: 'Law' },
  { name: 'Gibson Dunn', domain: 'gibsondunn.com', industry: 'Law' },
  { name: 'Jones Day', domain: 'jonesday.com', industry: 'Law' },
  { name: 'White & Case', domain: 'whitecase.com', industry: 'Law' },
  { name: 'Debevoise & Plimpton', domain: 'debevoise.com', industry: 'Law' },
  { name: 'Proskauer Rose', domain: 'proskauer.com', industry: 'Law' },
  { name: 'Ropes & Gray', domain: 'ropesgray.com', industry: 'Law' },
  { name: 'Willkie Farr', domain: 'willkie.com', industry: 'Law' },
  { name: 'Milbank', domain: 'milbank.com', industry: 'Law' },

  // Biotech & Pharma
  { name: 'Johnson & Johnson', domain: 'jnj.com', industry: 'Biotech & Pharma' },
  { name: 'Pfizer', domain: 'pfizer.com', industry: 'Biotech & Pharma' },
  { name: 'Eli Lilly', domain: 'lilly.com', industry: 'Biotech & Pharma' },
  { name: 'AbbVie', domain: 'abbvie.com', industry: 'Biotech & Pharma' },
  { name: 'Merck', domain: 'merck.com', industry: 'Biotech & Pharma' },
  { name: 'Bristol Myers Squibb', domain: 'bms.com', industry: 'Biotech & Pharma' },
  { name: 'Amgen', domain: 'amgen.com', industry: 'Biotech & Pharma' },
  { name: 'Gilead Sciences', domain: 'gilead.com', industry: 'Biotech & Pharma' },
  { name: 'Regeneron', domain: 'regeneron.com', industry: 'Biotech & Pharma' },
  { name: 'Biogen', domain: 'biogen.com', industry: 'Biotech & Pharma' },
  { name: 'Moderna', domain: 'modernatx.com', industry: 'Biotech & Pharma' },
  { name: 'Genentech', domain: 'gene.com', industry: 'Biotech & Pharma' },
  { name: 'Vertex Pharmaceuticals', domain: 'vrtx.com', industry: 'Biotech & Pharma' },
  { name: 'BioNTech', domain: 'biontech.com', industry: 'Biotech & Pharma' },
  { name: 'Alnylam', domain: 'alnylam.com', industry: 'Biotech & Pharma' },
  { name: 'Illumina', domain: 'illumina.com', industry: 'Biotech & Pharma' },
  { name: '10x Genomics', domain: '10xgenomics.com', industry: 'Biotech & Pharma' },
  { name: 'Ginkgo Bioworks', domain: 'ginkgobioworks.com', industry: 'Biotech & Pharma' },
  { name: 'Recursion', domain: 'recursion.com', industry: 'Biotech & Pharma' },
  { name: 'Insitro', domain: 'insitro.com', industry: 'Biotech & Pharma' },

  // Venture Capital
  { name: 'Sequoia Capital', domain: 'sequoiacap.com', industry: 'Venture Capital' },
  { name: 'Andreessen Horowitz', domain: 'a16z.com', industry: 'Venture Capital' },
  { name: 'Accel', domain: 'accel.com', industry: 'Venture Capital' },
  { name: 'Benchmark', domain: 'benchmark.com', industry: 'Venture Capital' },
  { name: 'Kleiner Perkins', domain: 'kleinerperkins.com', industry: 'Venture Capital' },
  { name: 'Founders Fund', domain: 'foundersfund.com', industry: 'Venture Capital' },
  { name: 'Lightspeed Venture Partners', domain: 'lsvp.com', industry: 'Venture Capital' },
  { name: 'GV', domain: 'gv.com', industry: 'Venture Capital' },
  { name: 'NEA', domain: 'nea.com', industry: 'Venture Capital' },
  { name: 'Bessemer Venture Partners', domain: 'bvp.com', industry: 'Venture Capital' },
  { name: 'General Catalyst', domain: 'generalcatalyst.com', industry: 'Venture Capital' },
  { name: 'Insight Partners', domain: 'insightpartners.com', industry: 'Venture Capital' },
  { name: 'Tiger Global', domain: 'tigerglobal.com', industry: 'Venture Capital' },
  { name: 'Coatue Management', domain: 'coatue.com', industry: 'Venture Capital' },
  { name: 'IVP', domain: 'ivp.com', industry: 'Venture Capital' },
  { name: 'Greylock', domain: 'greylock.com', industry: 'Venture Capital' },
  { name: 'Index Ventures', domain: 'indexventures.com', industry: 'Venture Capital' },
  { name: 'Union Square Ventures', domain: 'usv.com', industry: 'Venture Capital' },
  { name: 'First Round Capital', domain: 'firstround.com', industry: 'Venture Capital' },
  { name: 'Y Combinator', domain: 'ycombinator.com', industry: 'Venture Capital' },

  // Asset Management
  { name: 'Vanguard', domain: 'vanguard.com', industry: 'Asset Management' },
  { name: 'BlackRock', domain: 'blackrock.com', industry: 'Asset Management' },
  { name: 'Fidelity', domain: 'fidelity.com', industry: 'Asset Management' },
  { name: 'State Street', domain: 'statestreet.com', industry: 'Asset Management' },
  { name: 'T. Rowe Price', domain: 'troweprice.com', industry: 'Asset Management' },
  { name: 'PIMCO', domain: 'pimco.com', industry: 'Asset Management' },
  { name: 'Nuveen', domain: 'nuveen.com', industry: 'Asset Management' },
  { name: 'Franklin Templeton', domain: 'franklintempleton.com', industry: 'Asset Management' },
  { name: 'Invesco', domain: 'invesco.com', industry: 'Asset Management' },
  { name: 'Capital Group', domain: 'capitalgroup.com', industry: 'Asset Management' },
  { name: 'Wellington Management', domain: 'wellington.com', industry: 'Asset Management' },
  { name: 'Dimensional Fund Advisors', domain: 'dimensional.com', industry: 'Asset Management' },
  { name: 'Dodge & Cox', domain: 'dodgeandcox.com', industry: 'Asset Management' },
  { name: 'MFS Investment Management', domain: 'mfs.com', industry: 'Asset Management' },
  { name: 'Lord Abbett', domain: 'lordabbett.com', industry: 'Asset Management' },

  // Real Estate
  { name: 'CBRE', domain: 'cbre.com', industry: 'Real Estate' },
  { name: 'JLL', domain: 'jll.com', industry: 'Real Estate' },
  { name: 'Cushman & Wakefield', domain: 'cushmanwakefield.com', industry: 'Real Estate' },
  { name: 'Brookfield Asset Management', domain: 'brookfield.com', industry: 'Real Estate' },
  { name: 'Prologis', domain: 'prologis.com', industry: 'Real Estate' },
  { name: 'Starwood Capital', domain: 'starwoodcapital.com', industry: 'Real Estate' },
  { name: 'Related Companies', domain: 'related.com', industry: 'Real Estate' },
  { name: 'Hines', domain: 'hines.com', industry: 'Real Estate' },
  { name: 'Greystar', domain: 'greystar.com', industry: 'Real Estate' },
  { name: 'AvalonBay', domain: 'avalonbay.com', industry: 'Real Estate' },
  { name: 'Equity Residential', domain: 'equityresidential.com', industry: 'Real Estate' },
  { name: 'Simon Property Group', domain: 'simon.com', industry: 'Real Estate' },
  { name: 'Realty Income', domain: 'realtyincome.com', industry: 'Real Estate' },
  { name: 'Public Storage', domain: 'publicstorage.com', industry: 'Real Estate' },
  { name: 'Welltower', domain: 'welltower.com', industry: 'Real Estate' },

  // Engineering & Defense
  { name: 'Lockheed Martin', domain: 'lockheedmartin.com', industry: 'Engineering & Defense' },
  { name: 'Raytheon', domain: 'rtx.com', industry: 'Engineering & Defense' },
  { name: 'Boeing', domain: 'boeing.com', industry: 'Engineering & Defense' },
  { name: 'Northrop Grumman', domain: 'northropgrumman.com', industry: 'Engineering & Defense' },
  { name: 'General Dynamics', domain: 'gd.com', industry: 'Engineering & Defense' },
  { name: 'L3Harris', domain: 'l3harris.com', industry: 'Engineering & Defense' },
  { name: 'BAE Systems', domain: 'baesystems.com', industry: 'Engineering & Defense' },
  { name: 'Leidos', domain: 'leidos.com', industry: 'Engineering & Defense' },
  { name: 'SAIC', domain: 'saic.com', industry: 'Engineering & Defense' },
  { name: 'Booz Allen Hamilton', domain: 'boozallen.com', industry: 'Engineering & Defense' },
  { name: 'Jacobs', domain: 'jacobs.com', industry: 'Engineering & Defense' },
  { name: 'Aecom', domain: 'aecom.com', industry: 'Engineering & Defense' },
  { name: 'Parsons', domain: 'parsons.com', industry: 'Engineering & Defense' },
  { name: 'Bechtel', domain: 'bechtel.com', industry: 'Engineering & Defense' },
  { name: 'Fluor', domain: 'fluor.com', industry: 'Engineering & Defense' },
  { name: 'Halliburton', domain: 'halliburton.com', industry: 'Engineering & Defense' },
  { name: 'Schlumberger', domain: 'slb.com', industry: 'Engineering & Defense' },
  { name: 'Baker Hughes', domain: 'bakerhughes.com', industry: 'Engineering & Defense' },
  { name: 'Honeywell', domain: 'honeywell.com', industry: 'Engineering & Defense' },
  { name: 'GE Aerospace', domain: 'geaerospace.com', industry: 'Engineering & Defense' },

  // College Engineering Programs
  { name: 'MIT', domain: 'mit.edu', industry: 'College Engineering Programs' },
  { name: 'Stanford', domain: 'stanford.edu', industry: 'College Engineering Programs' },
  { name: 'Caltech', domain: 'caltech.edu', industry: 'College Engineering Programs' },
  { name: 'Carnegie Mellon', domain: 'cmu.edu', industry: 'College Engineering Programs' },
  { name: 'UC Berkeley', domain: 'berkeley.edu', industry: 'College Engineering Programs' },
  { name: 'Georgia Tech', domain: 'gatech.edu', industry: 'College Engineering Programs' },
  { name: 'University of Michigan', domain: 'umich.edu', industry: 'College Engineering Programs' },
  { name: 'Purdue', domain: 'purdue.edu', industry: 'College Engineering Programs' },
  { name: 'UT Austin', domain: 'utexas.edu', industry: 'College Engineering Programs' },
  { name: 'UIUC', domain: 'illinois.edu', industry: 'College Engineering Programs' },
  { name: 'Cornell', domain: 'cornell.edu', industry: 'College Engineering Programs' },
  { name: 'Princeton', domain: 'princeton.edu', industry: 'College Engineering Programs' },
  { name: 'UCLA', domain: 'ucla.edu', industry: 'College Engineering Programs' },
  { name: 'USC', domain: 'usc.edu', industry: 'College Engineering Programs' },
  { name: 'Virginia Tech', domain: 'vt.edu', industry: 'College Engineering Programs' },
  { name: 'Ohio State', domain: 'osu.edu', industry: 'College Engineering Programs' },
  { name: 'Penn State', domain: 'psu.edu', industry: 'College Engineering Programs' },
  { name: 'University of Wisconsin', domain: 'wisc.edu', industry: 'College Engineering Programs' },
  { name: 'Texas A&M', domain: 'tamu.edu', industry: 'College Engineering Programs' },
  { name: 'University of Washington', domain: 'uw.edu', industry: 'College Engineering Programs' },

  // College Business Programs
  { name: 'Wharton', domain: 'wharton.upenn.edu', industry: 'College Business Programs' },
  { name: 'Harvard Business School', domain: 'hbs.edu', industry: 'College Business Programs' },
  { name: 'Stanford GSB', domain: 'gsb.stanford.edu', industry: 'College Business Programs' },
  { name: 'Booth', domain: 'chicagobooth.edu', industry: 'College Business Programs' },
  { name: 'Kellogg', domain: 'kellogg.northwestern.edu', industry: 'College Business Programs' },
  { name: 'Stern', domain: 'stern.nyu.edu', industry: 'College Business Programs' },
  { name: 'Haas', domain: 'haas.berkeley.edu', industry: 'College Business Programs' },
  { name: 'Tuck', domain: 'tuck.dartmouth.edu', industry: 'College Business Programs' },
  { name: 'Ross', domain: 'bus.umich.edu', industry: 'College Business Programs' },
  { name: 'Fuqua', domain: 'fuqua.duke.edu', industry: 'College Business Programs' },
  { name: 'Darden', domain: 'darden.virginia.edu', industry: 'College Business Programs' },
  { name: 'McCombs', domain: 'mccombs.utexas.edu', industry: 'College Business Programs' },
  { name: 'Kelley', domain: 'kelley.iu.edu', industry: 'College Business Programs' },
  { name: 'Marshall', domain: 'marshall.usc.edu', industry: 'College Business Programs' },
  { name: 'Goizueta', domain: 'goizueta.emory.edu', industry: 'College Business Programs' },
  { name: 'Mendoza', domain: 'mendoza.nd.edu', industry: 'College Business Programs' },
  { name: 'Smeal', domain: 'smeal.psu.edu', industry: 'College Business Programs' },
  { name: 'Olin', domain: 'olin.wustl.edu', industry: 'College Business Programs' },
  { name: 'Foster', domain: 'foster.uw.edu', industry: 'College Business Programs' },
  { name: 'Questrom', domain: 'questrom.bu.edu', industry: 'College Business Programs' },

  // Technology Consulting
  { name: 'Accenture', domain: 'accenture.com', industry: 'Technology Consulting' },
  { name: 'IBM Consulting', domain: 'ibm.com', industry: 'Technology Consulting' },
  { name: 'Capgemini', domain: 'capgemini.com', industry: 'Technology Consulting' },
  { name: 'Cognizant', domain: 'cognizant.com', industry: 'Technology Consulting' },
  { name: 'Infosys', domain: 'infosys.com', industry: 'Technology Consulting' },
  { name: 'Wipro', domain: 'wipro.com', industry: 'Technology Consulting' },
  { name: 'TCS', domain: 'tcs.com', industry: 'Technology Consulting' },
  { name: 'HCL Technologies', domain: 'hcltech.com', industry: 'Technology Consulting' },
  { name: 'Tech Mahindra', domain: 'techmahindra.com', industry: 'Technology Consulting' },
  { name: 'Slalom', domain: 'slalom.com', industry: 'Technology Consulting' },
  { name: 'West Monroe', domain: 'westmonroe.com', industry: 'Technology Consulting' },
  { name: 'Publicis Sapient', domain: 'publicissapient.com', industry: 'Technology Consulting' },
  { name: 'Thoughtworks', domain: 'thoughtworks.com', industry: 'Technology Consulting' },
  { name: 'EPAM', domain: 'epam.com', industry: 'Technology Consulting' },
  { name: 'Globant', domain: 'globant.com', industry: 'Technology Consulting' },
]

async function seed() {
  console.log(`Seeding ${companies.length} companies...`)

  let inserted = 0
  let skipped = 0

  for (const company of companies) {
    // Check if already exists (domain is unique)
    const { data: existing } = await supabase
      .from('companies')
      .select('id')
      .eq('domain', company.domain)
      .eq('industry', company.industry)
      .maybeSingle()

    let companyId: string

    if (existing) {
      companyId = existing.id
      skipped++
    } else {
      const { data, error } = await supabase
        .from('companies')
        .insert(company)
        .select('id')
        .single()

      if (error) {
        console.error(`Failed to insert ${company.name}:`, error.message)
        continue
      }

      companyId = data.id
      inserted++
    }

    // Insert rating rows for all combinations (skip if already exist)
    const ratingRows = []
    for (const scope of INDUSTRY_SCOPES) {
      for (const level of VOTER_LEVELS) {
        ratingRows.push({
          company_id: companyId,
          industry_scope: scope,
          voter_level: level,
          elo: 1200,
          wins: 0,
          losses: 0,
          total_votes: 0,
        })
      }
    }

    const { error: ratingsError } = await supabase
      .from('ratings')
      .upsert(ratingRows, { onConflict: 'company_id,industry_scope,voter_level', ignoreDuplicates: true })

    if (ratingsError) {
      console.error(`Failed to insert ratings for ${company.name}:`, ratingsError.message)
    }
  }

  console.log(`Done. Inserted: ${inserted}, Skipped (already exist): ${skipped}`)
}

seed().catch(console.error)
